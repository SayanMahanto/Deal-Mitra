import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();
app.use(cors());
const port = 3001;

async function scrapeAmazon(url) {
  let browser;
  try {
    console.log("Fetching Amazon page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    $(".s-result-item").each((i, el) => {
      const name = $(el).find("h2 span").text().trim() || "N/A";
      const priceText =
        $(el)
          .find(".a-price-whole")
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText);
      const rating =
        $(el)
          .find(".a-icon-alt")
          .text()
          .match(/\d+\.\d+/)?.[0] || "0.0";
      const reviews =
        $(el)
          .find(".a-size-small .a-link-normal")
          .text()
          .replace(/[^\d]/g, "") || "0";
      const imageUrl = $(el).find("img.s-image").attr("src") || "N/A";

      if (name !== "N/A" && price !== 0 && imageUrl !== "N/A") {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
        });
      }
    });

    if (products.length === 0) {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      const dynamicProducts = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".s-result-item"));
        return items
          .map((item) => {
            try {
              const name =
                item.querySelector("h2 span")?.textContent.trim() || "N/A";
              const priceText =
                item.querySelector(".a-price-whole")?.textContent;
              const price = priceText
                ? parseFloat(priceText.replace(/[^\d.]/g, ""))
                : 0.0;
              const ratingText = item
                .querySelector(".a-icon-alt")
                ?.textContent.match(/\d+\.\d+/)?.[0];
              const rating = ratingText ? parseFloat(ratingText) : 0.0;
              const reviewsText = item
                .querySelector(".a-size-small .a-link-normal")
                ?.textContent.replace(/[^\d]/g, "");
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl = item.querySelector("img.s-image")?.src || "N/A";

              return { name, price, rating, reviews, image_url: imageUrl };
            } catch (e) {
              console.error("Error parsing product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.image_url !== "N/A"
          );
      });

      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Amazon scraping error:", e);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

async function scrapeFlipkart(url) {
  let browser;
  try {
    console.log("Fetching Flipkart page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    // Corrected selector: .cPHDOP.col-12-12 (no space)
    $(".cPHDOP.col-12-12").each((i, el) => {
      const name = $(el).find(".KzDlHZ").text().trim() || "N/A";
      // Corrected price selector: Ensure class is properly targeted
      const priceText =
        $(el)
          .find(".Nx9bqj._4b5DiR")
          .text()
          .replace(/[^\d.]/g, "") || "0.0";
      const price = parseFloat(priceText) || 0.0;
      const rating =
        $(el)
          .find(".XQDdHH")
          .text()
          .match(/\d+\.\d+/)?.[0] || "0.0";
      const reviews = $(el).find(".Wphh3N").text().match(/\d+/)?.[0] || "0";
      const imageUrl = $(el).find(".DByuf4").attr("src") || "N/A";

      if (name !== "N/A" && price !== 0 && imageUrl !== "N/A") {
        products.push({
          name,
          price,
          rating: parseFloat(rating),
          reviews: parseInt(reviews),
          image_url: imageUrl,
        });
      }
    });

    if (products.length === 0) {
      console.log(
        "No products found with Cheerio, falling back to Puppeteer..."
      );
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      // Corrected selector for waitForSelector
      await page
        .waitForSelector(".cPHDOP.col-12-12", { timeout: 10000 })
        .catch((e) =>
          console.log("Parent container selector not found:", e.message)
        );
      await autoScroll(page); // Ensure all products load

      // Take a screenshot for debugging
      await page.screenshot({ path: "flipkart-debug.png", fullPage: true });

      const dynamicProducts = await page.evaluate(() => {
        // Scope to product containers
        const items = Array.from(
          document.querySelectorAll(".cPHDOP.col-12-12")
        );
        console.log(`Found ${items.length} product containers`);
        return items
          .map((item) => {
            try {
              const name =
                item.querySelector(".KzDlHZ")?.textContent.trim() || "N/A";
              const priceText =
                item
                  .querySelector(".Nx9bqj._4b5DiR")
                  ?.textContent.replace(/[^\d.]/g, "") || "0.0";
              const price = priceText ? parseFloat(priceText) : 0.0;
              const ratingText =
                item
                  .querySelector(".XQDdHH")
                  ?.textContent.match(/\d+\.\d+/)?.[0] || "0.0";
              const rating = ratingText ? parseFloat(ratingText) : 0.0;
              const reviewsText =
                item.querySelector(".Wphh3N")?.textContent.match(/\d+/)?.[0] ||
                "0";
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl = item.querySelector(".DByuf4")?.src || "N/A";

              return { name, price, rating, reviews, image_url: imageUrl };
            } catch (e) {
              console.error("Error parsing Flipkart product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.image_url !== "N/A"
          );
      });

      console.log(`Puppeteer found ${dynamicProducts.length} products`);
      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Flipkart scraping error:", e);
    return [];
  } finally {
    if (browser) {
      console.log("Closing Puppeteer browser...");
      await browser.close();
    }
  }
}

async function scrapeBlinkit(url) {
  let browser;
  try {
    console.log("Fetching Blinkit page with Axios...");
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);

    const products = [];
    // Corrected selector: .cPHDOP.col-12-12 (no space)
    $(".tw-relative.tw-flex.tw-h-full.tw-flex-col.tw-items-start").each(
      (i, el) => {
        const name =
          $(el)
            .find(".tw-text-300.tw-font-semibold.tw-line-clamp-2")
            .text()
            .trim() || "N/A";
        // Corrected price selector: Ensure class is properly targeted
        const priceText =
          $(el)
            .find(".tw-text-200.tw-font-semibold")
            .text()
            .replace(/[^\d.]/g, "") || "0.0";
        const price = parseFloat(priceText) || 0.0;
        const rating =
          $(el)
            .find(".XQDdHH")
            .text()
            .match(/\d+\.\d+/)?.[0] || "0.0";
        const reviews = $(el).find(".Wphh3N").text().match(/\d+/)?.[0] || "0";
        const imageUrl =
          $(el)
            .find(".tw-h-full.tw-w-full.tw-transition-opacity.tw-opacity-100")
            .attr("src") || "N/A";

        if (name !== "N/A" && price !== 0 && imageUrl !== "N/A") {
          products.push({
            name,
            price,
            rating: parseFloat(rating),
            reviews: parseInt(reviews),
            image_url: imageUrl,
          });
        }
      }
    );

    if (products.length === 0) {
      console.log(
        "No products found with Cheerio, falling back to Puppeteer..."
      );
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      // Corrected selector for waitForSelector
      await page
        .waitForSelector(
          ".tw-relative.tw-flex.tw-h-full.tw-flex-col.tw-items-start",
          { timeout: 10000 }
        )
        .catch((e) =>
          console.log("Parent container selector not found:", e.message)
        );
      await autoScroll(page); // Ensure all products load

      const dynamicProducts = await page.evaluate(() => {
        // Scope to product containers
        const items = Array.from(
          document.querySelectorAll(
            ".tw-relative.tw-flex.tw-h-full.tw-flex-col.tw-items-start"
          )
        );
        console.log(`Found ${items.length} product containers`);
        return items
          .map((item) => {
            try {
              const name =
                item
                  .querySelector(
                    ".tw-text-300.tw-font-semibold.tw-line-clamp-2"
                  )
                  ?.textContent.trim() || "N/A";
              const priceText =
                item
                  .querySelector(".tw-text-200.tw-font-semibold")
                  ?.textContent.replace(/[^\d.]/g, "") || "0.0";
              const price = priceText ? parseFloat(priceText) : 0.0;
              const ratingText =
                item
                  .querySelector(".XQDdHH")
                  ?.textContent.match(/\d+\.\d+/)?.[0] || "0.0";
              const rating = ratingText ? parseFloat(ratingText) : 0.0;
              const reviewsText =
                item.querySelector(".Wphh3N")?.textContent.match(/\d+/)?.[0] ||
                "0";
              const reviews = reviewsText ? parseInt(reviewsText) : 0;
              const imageUrl =
                item.querySelector(
                  ".tw-h-full.tw-w-full.tw-transition-opacity.tw-opacity-100"
                )?.src || "N/A";

              return { name, price, rating, reviews, image_url: imageUrl };
            } catch (e) {
              console.error("Error parsing Blinkit product:", e);
              return null;
            }
          })
          .filter(
            (item) =>
              item !== null &&
              item.name !== "N/A" &&
              item.price !== 0 &&
              item.image_url !== "N/A"
          );
      });

      console.log(`Puppeteer found ${dynamicProducts.length} products`);
      return dynamicProducts.length > 0 ? dynamicProducts : products;
    }

    return products;
  } catch (e) {
    console.error("Blinkit scraping error:", e);
    return [];
  } finally {
    if (browser) {
      console.log("Closing Puppeteer browser...");
      await browser.close();
    }
  }
}

// Helper function to scroll page for dynamic content
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

app.get("/scrape-amazon", async (req, res) => {
  const search = req.query.search || "Samsung Galaxy F14 5G";
  const url = `https://www.amazon.in/s?k=${search.replace(/ /g, "+")}`;
  const products = await scrapeAmazon(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({ error: "No data scraped from Amazon" });
  }
});

app.get("/scrape-flipkart", async (req, res) => {
  const search = req.query.search || "Samsung Galaxy F14 5G";
  const url = `https://www.flipkart.com/search?q=${search.replace(/ /g, "+")}`;
  const products = await scrapeFlipkart(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({
      error: "No data scraped from Flipkart",
      details: "Check server logs or flipkart-debug.png for more info",
    });
  }
});

app.get("/scrape-blinkit", async (req, res) => {
  const search = req.query.search || "Samsung Galaxy F14 5G";
  const url = `https://blinkit.com/s/?q=${search.replace(/ /g, "%20")}`;
  const products = await scrapeBlinkit(url);
  if (products.length > 0) {
    res.json(products);
  } else {
    res.status(500).json({
      error: "No data scraped from Blinkit",
      details: "Check server logs or blinkit-debug.png for more info",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

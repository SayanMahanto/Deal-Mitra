import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email,  password, confirmPassword } = formData;

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert(`🎉 Registered Successfully!\n\nWelcome, ${name}!`);
    setFormData({
      name: "",
      email: "",
     
      password: "",
      confirmPassword: "",
    });
  };

  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      background: `linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#fff",
    },
    formWrapper: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(16px)",
      borderRadius: "18px",
      padding: "2.5rem 2.5rem",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
      maxWidth: "480px",
      width: "100%",
      animation: "fadeIn 0.9s ease-out",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    heading: {
      marginBottom: "24px",
      fontSize: "30px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#FFF",
    },
    inputGroup: {
      position: "relative",
      margin: "16px 0",
    },
    icon: {
      position: "absolute",
      top: "50%",
      left: "14px",
      transform: "translateY(-50%)",
      color: "#aaa",
      fontSize: "14px",
      pointerEvents: "none",
    },
    input: {
      width: "100%",
      padding: "13px 13px 13px 42px",
      borderRadius: "10px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      color: "#fff",
      fontSize: "15px",
      outline: "none",
      transition: "0.3s ease",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(to right, #06beb6, #48b1bf)",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "20px",
      transition: "all 0.3s ease",
    },
    backLink: {
      marginTop: "22px",
      fontSize: "14px",
      textAlign: "center",
      color: "#ccc",
    },
    anchor: {
      color: "#ffffff",
      textDecoration: "underline",
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}><i className="fas fa-store"></i> Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {[
            { icon: "fas fa-user", id: "name", type: "text", placeholder: "Full Name" },
            { icon: "fas fa-envelope", id: "email", type: "email", placeholder: "Email Address" },
            
            { icon: "fas fa-lock", id: "password", type: "password", placeholder: "Password" },
            { icon: "fas fa-lock", id: "confirmPassword", type: "password", placeholder: "Confirm Password" },
          ].map(({ icon, id, type, placeholder }) => (
            <div className="input-group" style={styles.inputGroup} key={id}>
              <i className={icon} style={styles.icon}></i>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={formData[id]}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          ))}

          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.backLink}>
          Already registered? <a href="index.html" style={styles.anchor}>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

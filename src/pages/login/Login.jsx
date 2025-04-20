import React from "react";

const SignIn = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log("Email:", email, "Password:", password);
    // TODO: Add your sign-in logic
  };

  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      background: "linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)",
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
      <style>
        {`
          input:focus {
            border-color: #06beb6;
            box-shadow: 0 0 0 2px rgba(6, 190, 182, 0.4);
          }

          button:hover {
            background: linear-gradient(to right, #48b1bf, #06beb6);
            transform: translateY(-1px);
          }

          
           
        `}
      </style>

      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <i className="fas fa-envelope" style={styles.icon}></i>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              autoComplete="email"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <i className="fas fa-lock" style={styles.icon}></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
        <p style={styles.backLink}>
          Don&apos;t have an account?{" "}
          <a href="signup.html" style={styles.anchor}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

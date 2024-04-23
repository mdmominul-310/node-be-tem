const signUpSuccessEmailTemplate = (name: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Martian+Mono:wght@300;400;600;700&display=swap"
        rel="stylesheet"
      />
      <title>Document</title>
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Martian Mono', monospace;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
      "
    >
      <h1 style="text-align: center">
        Hi!<span style="color: #0069ff; margin: 20px 0">${name}</span>
      </h1>
      <h2 style="text-align: center; margin: 0; font-size: 16px">
        Welcome to Captake.com
      </h2>
      <p
        style="
          text-align: center;
          padding: 8px;
          font-size: 15px;
          line-height: 25px;
        "
      >
        Your account has been confirmed and your account is ready. Please close
        this page and back to the app to login
      </p>
      <img
        style="width: 100%"
        src="https://img.freepik.com/free-vector/flat-design-colorful-characters-welcoming_23-2148271988.jpg?w=1060&t=st=1695828881~exp=1695829481~hmac=14228cab043591dd2349c2f93e62daeb7df327e6dd38568c4a1006c03cd48ae7"
        alt=""
      />
      <div style="text-align: center">
        <a
          style="
            text-decoration: none;
            background-color: #0131ff;
            color: white;
            padding: 10px;
            border-radius: 4px;
          "
          href="#"
          >Start Shopping</a
        >
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 40px;
        "
      >
        <a style="text-decoration: none; color: #a27bdd; font-size: 14px" href="#"
          >FAQs</a
        >
        <a
          style="
            text-decoration: none;
            color: #a27bdd;
            margin: 0 30px;
            font-size: 14px;
          "
          href="#"
          >Terms & Conditions</a
        >
        <a style="text-decoration: none; color: #a27bdd; font-size: 14px" href="#"
          >Contact Us</a
        >
      </div>
    </body>
  </html>
  
`
}

export default signUpSuccessEmailTemplate

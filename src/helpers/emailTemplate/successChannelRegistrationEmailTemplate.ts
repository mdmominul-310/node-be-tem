
const successChannelRegEmailTemplate = (vendorName: string) => (

    `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Vendor Email</title>
    <style>
      /* Reset styles */
      body,
      p,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        background-color: #f4f4f4;
        overflow-x: hidden;
        display: flex;
        justify-content: center;
        align-items: center; /* Add this line */
        height: 100vh; /* Change height to viewport height */
      }
      /* Container */
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      /* Header */
      .header {
        background-color: #1877f2;
        color: #fff;
        text-align: center;
        padding: 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      /* Content */
      .content {
        padding: 20px;
      }
      /* Footer */
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      /* Button */
      .button {
        display: inline-block;
        background-color: #4caf50;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
      }
      /* Responsive */
      @media only screen and (max-width: 600px) {
        .container {
          border-radius: 0;
          box-shadow: none;
        }
        .header,
        .footer {
          border-radius: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="logo_white_logo.png" />
        <h1>Welcome to Our Seller Program</h1>
      </div>
      <div class="content">
        <p>Dear ${vendorName},</p>
        <p>
          Thank you for joining our vendor program. We are excited to partner
          with you!
        </p>
        <p>
          Please review the attached documents and let us know if you have any
          questions or concerns.
        </p>
        <p>We look forward to a successful collaboration.</p>
        <p>
          Best regards,<br />
          Captake
        </p>
      </div>
      <div class="footer">
        <p>Follow us on <a href="#">Twitter</a> | <a href="#">Facebook</a></p>
      </div>
    </div>
  </body>
</html>

    `
)

export default successChannelRegEmailTemplate;
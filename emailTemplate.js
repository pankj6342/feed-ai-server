const emailTemplate = ` <html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Newsletter</title>
  <style>
    /* Basic styling for a clean, readable layout */
    body {
      font-family: sans-serif;
    }
    h1, h2, h3 {
      margin-top: 0;
    }
    a {
      color: #336699;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <header>
    <h1>Your Newsletter</h1>
    </header>

  <main>
    <h2>Hi {{name}},</h2>
    <p>Welcome to your latest newsletter! Here are some interesting updates for you:</p>

    {{#if articles}}
      {{#each articles}}
        <section>
          <h3>{{title}}</h3>
          <p>{{excerpt}}</p>
          <a href="{{link}}" class="read-more">Read More</a>
        </section>
      {{/each}}
    {{else}}
      <p>There are no articles to display at this time.</p>
    {{/if}}

    <p>Stay tuned for more great content!</p>
  </main>

  <footer>
    <p>
      <a href="{{unsubscribeLink}}">Unsubscribe</a> |
      <a href="#">Manage Preferences</a> |
      <a href="#">Contact Us</a>
    </p>
    <p>&copy; {{currentYear}} Your Company Name</p>
  </footer>
</body>
</html>
`;
module.exports = {emailTemplate}
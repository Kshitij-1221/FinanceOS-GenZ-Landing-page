// Versioned content: retries use the exact payload saved in the private outbox.
export function welcomeEmail(support: string) {
  const safe = support.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  return {
    subject: "You're on the list — welcome to Blyth",
    text: `Welcome to Blyth. You're on the early-access list!\n\nWe're building a calmer way to track your spending, savings, goals and investments in one place. We'll email you when early access opens. You don't need to do anything else today.\n\nJoining the waitlist does not create an app account or start a subscription.\n\nExplore Blyth: https://www.getblyth.com\nPrivacy: https://www.getblyth.com/privacy\nDidn't request this, or want to leave the list? Reply to this email or contact ${support}.`,
    html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Welcome to Blyth</title><style>@media only screen and (max-width:480px){.outer{padding:24px 12px!important}.content{padding:28px 22px!important}.heading{font-size:32px!important;line-height:39px!important}}</style></head>
<body style="margin:0;padding:0;background-color:#050505;color:#f6f5ef;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">You're on the list. A calmer way to manage money is on its way.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#050505"><tr><td class="outer" align="center" style="padding:48px 16px">
<!--[if mso]><table role="presentation" width="560"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#11110f" style="max-width:560px;border:1px solid #363326;border-radius:24px"><tr><td class="content" style="padding:36px;font-family:Arial,sans-serif">
<img src="https://www.getblyth.com/brand/blyth-lockup-dark-v1.png" width="162" height="64" alt="Blyth" style="display:block;width:162px;max-width:100%;height:auto;border:0;color:#fff;font-size:26px;font-weight:800">
<p style="margin:38px 0 12px;color:#d4af37;font-size:12px;line-height:18px;font-weight:700;letter-spacing:2px">WELCOME TO THE WAITLIST</p>
<h1 class="heading" style="margin:0;color:#f6f5ef;font-size:40px;line-height:47px;font-weight:800;letter-spacing:-1.4px">Less money stress.<br><span style="color:#fcd34d">More room to live.</span></h1>
<p style="margin:22px 0 28px;color:#c5c3b9;font-size:16px;line-height:26px">You're on the list! We're building a calmer way to track your spending, savings, goals and investments in one place.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#fcd34d" style="border:1px solid #d4af37;border-radius:16px"><tr><td style="padding:24px;color:#1a1202">
<p style="margin:0 0 8px;font-size:19px;line-height:26px;font-weight:700">Your next step? Take a breath.</p>
<p style="margin:0;font-size:15px;line-height:24px">We'll email you when early access opens. You don't need to do anything else today.</p>
</td></tr></table>
<p style="margin:24px 0;color:#b3b0a4;font-size:14px;line-height:23px">This is a waitlist confirmation. It doesn't create an app account or start a subscription.</p>
<p style="margin:0 0 28px"><a href="https://www.getblyth.com" style="color:#fcd34d;font-size:16px;font-weight:700;text-decoration:underline">Explore Blyth &rarr;</a></p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid #363326;padding-top:24px;color:#b3b0a4;font-size:13px;line-height:22px">Didn't request this, or want to leave the list? Reply to this email or <a href="mailto:${safe}" style="color:#fcd34d">contact us</a>. <a href="https://www.getblyth.com/privacy" style="color:#b3b0a4">Privacy notice</a></td></tr></table>
</td></tr></table><p style="margin:20px 0 0;color:#a5a298;font-family:Arial,sans-serif;font-size:12px;line-height:20px">Blyth · A calmer relationship with money</p>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`,
  };
}

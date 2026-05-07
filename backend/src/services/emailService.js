import { Resend } from 'resend';

// Lazily initialize Resend client to avoid import-time errors when env is not yet loaded
let resendClient = null;
const getResendClient = () => {
    if (resendClient) return resendClient;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        // Throw a clear error that will be caught by calling code
        throw new Error('RESEND_API_KEY is not configured. Please set RESEND_API_KEY in your environment.');
    }
    resendClient = new Resend(apiKey);
    return resendClient;
};

/**
 * Send contact form submission email via Resend
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.serviceType - Type of service requested
 * @param {string} contactData.budget - Budget range
 * @param {string} contactData.description - Project description
 * @param {string} [contactData.company] - Optional company name
 * @param {string} [contactData.phone] - Optional phone number
 * @returns {Promise<Object>} Resend response object
 */
export const sendContactEmail = async (contactData) => {
    const {
        name,
        email,
        serviceType,
        budget,
        description,
        company = 'Not provided',
        phone = 'Not provided',
    } = contactData;

    // HTML email template with professional Metal Web branding
    const htmlContent = generateEmailTemplate({
        name,
        email,
        serviceType,
        budget,
        description,
        company,
        phone,
    });

    try {
        const resend = getResendClient();

        const response = await resend.emails.send({
            from: 'contact@metalweb.site',
            to: 'contact@metalweb.site',
            subject: 'New Contact Form Submission - Metal Web',
            html: htmlContent,
            replyTo: email,
        });

        // Log successful email send with correct response structure
        const emailId = response?.id || 'sent';
        console.log(`Email sent successfully: ${emailId}`);

        return {
            success: true,
            messageId: emailId,
        };
    } catch (error) {
        // Log full error for debugging and rethrow original error
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Generate professional HTML email template
 * @param {Object} data - Contact form data
 * @returns {string} HTML email template
 */
const generateEmailTemplate = (data) => {
    const {
        name,
        email,
        serviceType,
        budget,
        description,
        company,
        phone,
    } = data;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
        <title>New Contact Form Submission</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f8f8f6;
            color: #0d1b2a;
            padding: 20px 0;
          }
          .container {
            max-width: 680px;
            margin: 0 auto;
            background:#FFFF5C; /* primary yellow */
            border: 1px solid #e6e6e6;
            border-radius: 20px;
            overflow: hidden;
            border:2px solid black
          }
          .header {
          margin:10px 0px 10px 0px ;
            display: flex;
            align-items: center;
            justify-content:center;
            gap: 16px;
            background: #FFFF5C;
          }
.logo-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

hr{
border-top:2px solid black;
}
.li-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  color: #0d1b2a;
  letter-spacing: -0.02em;
}

          .logo-svg { width: 56px; height: 56px; display: block; }
.logo-text {
  font-family:'Space Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #0d1b2a;
  text-align: center;
}
          .sub {
            color: #7a7a7a;
            font-size: 13px;
            margin-top: 4px;
          }
          .content { padding: 24px; }
          .section { margin-bottom: 18px; }
          .label { display:block; font-weight:700; color:#7a7a7a; font-size:12px; text-transform:uppercase; margin-bottom:8px; }
          .value { color: #0d1b2a; font-size:14px; line-height:1.6; background:#fbfbfb; padding:12px; border-left:4px solid #efe13f; border-radius:4px; }
          .description-box { background:#fbfbfb; padding:16px; border-left:4px solid #efe13f; border-radius:4px; color:#0d1b2a; font-size:14px; line-height:1.6; }
          .divider { height:1px; background:black; margin:20px 0; }
          .footer { padding:18px 24px; text-align:center; border-top:1px solid #f0f0f0; color:#7a7a7a; font-size:13px; }
          .footer .brand-name { color:#0d1b2a; font-weight:700; display:block; margin-bottom:6px; }
          @media (max-width:600px){ .header{padding:16px} .content{padding:16px} }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
          <div>
              <div class="logo-text">METAL_WEB</div>
              <div class="sub">New contact form submission</div>
            </div>
          </div>
          <hr>
          <div class="content">
          <div class="section">
            <span class="label">Sender Name</span>
            <div class="value">${escapeHtml(name)}</div>
          </div>

          <div class="section">
            <span class="label">Email Address</span>
            <div class="value">
              <a href="mailto:${escapeHtml(email)}" style="color: #c0392b; text-decoration: none;">
                ${escapeHtml(email)}
              </a>
            </div>
          </div>

          ${company !== 'Not provided' ? `
          <div class="section">
            <span class="label">Company</span>
            <div class="value">${escapeHtml(company)}</div>
          </div>
          ` : ''}

          ${phone !== 'Not provided' ? `
          <div class="section">
            <span class="label">Phone Number</span>
            <div class="value">${escapeHtml(phone)}</div>
          </div>
          ` : ''}

          <div class="section">
            <span class="label">Service Type</span>
            <div class="value">${escapeHtml(serviceType)}</div>
          </div>

          <div class="section">
            <span class="label">Budget Range</span>
            <div class="value">${escapeHtml(budget)}</div>
          </div>

          <div class="divider"></div>

          <div class="section">
            <span class="label">Project Description</span>
            <div class="description-box">
              ${escapeHtml(description).replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>

        <div class="divider"></div>
        <div class="footer">
          <span class="brand-name">METAL WEB</span>
          <span>Professional Web Development & Digital Solutions</span>
          <div style="margin-top:8px;">
            <a href="mailto:contact@metalweb.site" style="color:#0d1b2a;text-decoration:none;">contact@metalweb.site</a> • <a href="https://metalweb.site" style="color:#0d1b2a;text-decoration:none;">metalweb.site</a>
          </div>
          <div style="margin-top:8px;color:#9b9b9b;font-size:12px;">Submitted at: ${new Date().toLocaleString()}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Escape HTML special characters to prevent injection
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeHtml = (text) => {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
};

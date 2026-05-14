import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const client = new SESv2Client({ region: process.env.AWS_REGION ?? 'us-east-1' });
const FROM = process.env.SES_FROM_EMAIL ?? 'noreply@example.com';

export interface MatchNotificationPayload {
  to: string;          // LOST item owner's email
  ownerName: string;
  foundItemTitle: string;
  foundCategory: string;
  founderName: string;
  founderEmail: string;
  locationName?: string | null;
}

export async function sendMatchNotification(p: MatchNotificationPayload) {
  const subject = `Someone may have found your lost ${p.foundCategory.toLowerCase()} item!`;

  const html = `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#3B2F2F">
  <h2 style="color:#C0392B;margin-bottom:4px">Good news, ${p.ownerName}!</h2>
  <p style="color:#7A6E6E;margin-top:0">
    <strong>${p.founderName}</strong> just reported finding a
    <strong>${p.foundCategory}</strong> item that might be yours.
  </p>

  <table style="width:100%;border-collapse:collapse;margin:20px 0">
    <tr>
      <td style="padding:8px 12px;background:#F2EBE3;border:1px solid #e0d6ce;font-weight:600">Item</td>
      <td style="padding:8px 12px;border:1px solid #e0d6ce">${p.foundItemTitle}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;background:#F2EBE3;border:1px solid #e0d6ce;font-weight:600">Category</td>
      <td style="padding:8px 12px;border:1px solid #e0d6ce">${p.foundCategory}</td>
    </tr>
    ${p.locationName ? `
    <tr>
      <td style="padding:8px 12px;background:#F2EBE3;border:1px solid #e0d6ce;font-weight:600">Location</td>
      <td style="padding:8px 12px;border:1px solid #e0d6ce">${p.locationName}</td>
    </tr>` : ''}
  </table>

  <p>
    Reach out to <strong>${p.founderName}</strong> directly:
    <a href="mailto:${p.founderEmail}" style="color:#C0392B">${p.founderEmail}</a>
  </p>

  <hr style="border:none;border-top:1px solid #e0d6ce;margin:24px 0" />
  <p style="font-size:0.8rem;color:#A89E9E">
    You received this because you reported a lost ${p.foundCategory.toLowerCase()} item on Lost&amp;Found.
    If this isn't your item, no action is needed.
  </p>
</div>`;

  const text =
    `Good news, ${p.ownerName}!\n\n` +
    `${p.founderName} reported finding a ${p.foundCategory} item that might be yours.\n` +
    `Item: ${p.foundItemTitle}\n` +
    (p.locationName ? `Location: ${p.locationName}\n` : '') +
    `\nContact ${p.founderName} at: ${p.founderEmail}\n`;

  await client.send(
    new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [p.to] },
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: 'UTF-8' },
          Body: {
            Html: { Data: html, Charset: 'UTF-8' },
            Text: { Data: text, Charset: 'UTF-8' },
          },
        },
      },
    })
  );
}

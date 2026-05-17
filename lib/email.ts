import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Halfsphere <noreply@halfsphere.com>";

export async function sendApprovalEmail(
  email: string,
  displayName: string,
  tempPassword: string
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "你的 Halfsphere 访问申请已通过",
    html: `
<!DOCTYPE html>
<html lang="zh">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0B;font-family:monospace">
  <div style="max-width:520px;margin:48px auto;padding:40px;background:#121214;border:1px solid #26262A;border-radius:8px">
    <div style="margin-bottom:32px">
      <span style="font-size:11px;letter-spacing:0.18em;color:#8E8E93;text-transform:uppercase">HALFSPHERE</span>
    </div>
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#E5E5E7">申请已通过</h1>
    <p style="margin:0 0 32px;font-size:13px;color:#8E8E93">你好，${displayName}</p>

    <div style="background:#0A0A0B;border:1px solid #26262A;border-radius:6px;padding:20px;margin-bottom:32px">
      <div style="margin-bottom:12px">
        <span style="font-size:10px;letter-spacing:0.15em;color:#8E8E93;text-transform:uppercase">登录地址</span>
        <div style="margin-top:4px;font-size:13px;color:#FFB020">https://halfsphere.com/login</div>
      </div>
      <div style="margin-bottom:12px">
        <span style="font-size:10px;letter-spacing:0.15em;color:#8E8E93;text-transform:uppercase">邮箱</span>
        <div style="margin-top:4px;font-size:13px;color:#E5E5E7">${email}</div>
      </div>
      <div>
        <span style="font-size:10px;letter-spacing:0.15em;color:#8E8E93;text-transform:uppercase">临时密码</span>
        <div style="margin-top:4px;font-size:14px;font-weight:600;color:#FFB020;letter-spacing:0.1em">${tempPassword}</div>
      </div>
    </div>

    <p style="margin:0 0 32px;font-size:12px;color:#6E6E76">首次登录后请立即修改密码。</p>

    <div style="border-top:1px solid #26262A;padding-top:24px">
      <span style="font-size:11px;color:#4A4A4F">— Halfsphere</span>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendRejectionEmail(email: string, displayName: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "关于你的 Halfsphere 访问申请",
    html: `
<!DOCTYPE html>
<html lang="zh">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0A0A0B;font-family:monospace">
  <div style="max-width:520px;margin:48px auto;padding:40px;background:#121214;border:1px solid #26262A;border-radius:8px">
    <div style="margin-bottom:32px">
      <span style="font-size:11px;letter-spacing:0.18em;color:#8E8E93;text-transform:uppercase">HALFSPHERE</span>
    </div>
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#E5E5E7">关于你的申请</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#8E8E93">你好，${displayName}</p>
    <p style="margin:0 0 32px;font-size:13px;color:#6E6E76;line-height:1.7">
      感谢你的申请，本次暂未通过审核。<br>
      如有疑问，请回复此邮件。
    </p>
    <div style="border-top:1px solid #26262A;padding-top:24px">
      <span style="font-size:11px;color:#4A4A4F">— Halfsphere</span>
    </div>
  </div>
</body>
</html>`,
  });
}

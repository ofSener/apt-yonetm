import nodemailer from 'nodemailer';

// Mail transporter configuration
let transporter: nodemailer.Transporter;

// Development environment setup - uses ethereal.email test account
if (process.env.NODE_ENV === 'development') {
  // Create test account for development
  const createTestAccount = async () => {
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  };

  // Initialize development transporter
  const initDevTransporter = async () => {
    if (!transporter) {
      transporter = await createTestAccount();
    }
    return transporter;
  };
}
// Production environment setup
else {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// Email templates
export const emailTemplates = {
  // Payment notification
  paymentReminder: (name: string, amount: number, dueDate: string) => ({
    subject: 'Aidat Ödeme Hatırlatması',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">AptYonetim - Aidat Ödeme Hatırlatması</h2>
        <p>Sayın ${name},</p>
        <p>Bu ay için <strong>${amount.toLocaleString('tr-TR')}₺</strong> tutarındaki aidat ödemenizin son ödeme tarihi <strong>${dueDate}</strong>'dir.</p>
        <p>Ödemenizi zamanında yapmanız için bu hatırlatmayı gönderiyoruz.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Tutar:</strong> ${amount.toLocaleString('tr-TR')}₺</p>
          <p style="margin: 8px 0 0;"><strong>Son Ödeme Tarihi:</strong> ${dueDate}</p>
        </div>
        <p>Ödemenizi AptYonetim uygulaması üzerinden veya banka havalesi ile yapabilirsiniz.</p>
        <p>Sorularınız için apartman yönetimiyle iletişime geçebilirsiniz.</p>
        <p>Saygılarımızla,<br>AptYonetim Ekibi</p>
      </div>
    `,
  }),

  // Maintenance request update
  maintenanceUpdate: (name: string, requestTitle: string, status: string, message: string) => ({
    subject: 'Bakım Talebi Güncellemesi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">AptYonetim - Bakım Talebi Güncellemesi</h2>
        <p>Sayın ${name},</p>
        <p>"<strong>${requestTitle}</strong>" başlıklı bakım talebinizle ilgili bir güncelleme var.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Durum:</strong> ${status}</p>
          <p style="margin: 8px 0 0;"><strong>Mesaj:</strong> ${message}</p>
        </div>
        <p>Detayları görmek ve yanıt vermek için AptYonetim uygulamanızı kullanabilirsiniz.</p>
        <p>Saygılarımızla,<br>AptYonetim Ekibi</p>
      </div>
    `,
  }),

  // Announcement notification
  announcementNotification: (name: string, title: string, content: string) => ({
    subject: `Yeni Duyuru: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">AptYonetim - Yeni Duyuru</h2>
        <p>Sayın ${name},</p>
        <p>Apartmanınız ile ilgili yeni bir duyuru yayınlandı.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4b5563;">${title}</h3>
          <div>${content}</div>
        </div>
        <p>Tüm duyuruları görmek için AptYonetim uygulamanızı kullanabilirsiniz.</p>
        <p>Saygılarımızla,<br>AptYonetim Ekibi</p>
      </div>
    `,
  }),

  // Meeting invitation
  meetingInvitation: (name: string, title: string, date: string, time: string, location: string) => ({
    subject: `Toplantı Daveti: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">AptYonetim - Toplantı Daveti</h2>
        <p>Sayın ${name},</p>
        <p>Apartman yönetimi tarafından düzenlenen bir toplantıya davetlisiniz.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4b5563;">${title}</h3>
          <p style="margin: 8px 0 0;"><strong>Tarih:</strong> ${date}</p>
          <p style="margin: 8px 0 0;"><strong>Saat:</strong> ${time}</p>
          <p style="margin: 8px 0 0;"><strong>Yer:</strong> ${location}</p>
        </div>
        <p>Tüm toplantıları görmek ve katılım durumunuzu belirtmek için AptYonetim uygulamanızı kullanabilirsiniz.</p>
        <p>Saygılarımızla,<br>AptYonetim Ekibi</p>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    // Ensure transporter is initialized in development mode
    if (process.env.NODE_ENV === 'development' && typeof transporter === 'undefined') {
      const initTransporter = await import('./email').then(
        (module) => (module as any).initDevTransporter
      );
      transporter = await initTransporter();
    }

    // Send mail
    const info = await transporter.sendMail({
      from: `"AptYonetim" <${process.env.EMAIL_FROM || 'aptyonetim@example.com'}>`,
      to,
      subject,
      html,
    });

    // Log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`Email sent: ${info.messageId}`);
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Notification sending functions
export async function sendPaymentReminder(email: string, name: string, amount: number, dueDate: string) {
  const template = emailTemplates.paymentReminder(name, amount, dueDate);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendMaintenanceUpdate(
  email: string, 
  name: string, 
  requestTitle: string, 
  status: string, 
  message: string
) {
  const template = emailTemplates.maintenanceUpdate(name, requestTitle, status, message);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAnnouncementNotification(
  email: string, 
  name: string, 
  title: string, 
  content: string
) {
  const template = emailTemplates.announcementNotification(name, title, content);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendMeetingInvitation(
  email: string, 
  name: string, 
  title: string, 
  date: string, 
  time: string, 
  location: string
) {
  const template = emailTemplates.meetingInvitation(name, title, date, time, location);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
} 
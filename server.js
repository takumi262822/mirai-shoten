/**
 * 未来商店 お問い合わせ自動返信サーバー
 * - POST /api/contact でフォームデータを受け取り、nodemailer で自動返信メールを送信する
 * @author Takumi Harada
 * @date 2026-04-06
 */
import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// --- ミドルウェア ---
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:5500" }));
app.use(express.json());
app.use(express.static("."));

// --- 入力値の簡易サニタイズ（XSS対策：メール本文内のHTMLタグを除去） ---
function sanitize(value) {
    if (typeof value !== "string") return "";
    return value.replace(/[<>]/g, "").trim().slice(0, 500);
}

// --- POST /api/contact ---
app.post("/api/contact", async (req, res) => {
    const { name, kana, tel, email, pref, usage, category, message } = req.body;

    // 必須フィールドの存在チェック（サーバー側バリデーション）
    if (!name || !email || !tel) {
        return res.status(400).json({ ok: false, error: "必須項目が不足しています。" });
    }

    // メールアドレスの形式チェック
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ ok: false, error: "メールアドレスの形式が正しくありません。" });
    }

    const safeName     = sanitize(name);
    const safeKana     = sanitize(kana);
    const safeTel      = sanitize(tel);
    const safeEmail    = sanitize(email);
    const safePref     = sanitize(pref);
    const safeUsage    = sanitize(usage);
    const safeCategory = sanitize(category);
    const safeMessage  = sanitize(message);

    // --- Nodemailer トランスポーター設定（Gmail利用） ---
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // --- 送信者側（店舗）への通知メール ---
    const shopMail = {
        from: `"未来商店 お問い合わせ" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: `【お問い合わせ受信】${safeName} 様より`,
        text: [
            "新しいお問い合わせが届きました。",
            "",
            `お名前　　　: ${safeName}（${safeKana}）`,
            `電話番号　　: ${safeTel}`,
            `メールアドレス: ${safeEmail}`,
            `都道府県　　: ${safePref}`,
            `ご利用状況　: ${safeUsage}`,
            `お問い合わせ項目: ${safeCategory}`,
            "",
            "【メッセージ内容】",
            safeMessage || "（なし）",
        ].join("\n"),
    };

    // --- お客様への自動返信メール ---
    const replyMail = {
        from: `"未来商店" <${process.env.MAIL_USER}>`,
        to: safeEmail,
        subject: "【未来商店】お問い合わせを受け付けました",
        text: [
            `${safeName} 様`,
            "",
            "この度はお問い合わせいただきありがとうございます。",
            "以下の内容でお問い合わせを受け付けました。",
            "担当者より改めてご連絡いたしますので、しばらくお待ちください。",
            "",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━",
            `お名前　　　: ${safeName}（${safeKana}）`,
            `電話番号　　: ${safeTel}`,
            `メールアドレス: ${safeEmail}`,
            `都道府県　　: ${safePref}`,
            `ご利用状況　: ${safeUsage}`,
            `お問い合わせ項目: ${safeCategory}`,
            "",
            "【メッセージ内容】",
            safeMessage || "（なし）",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "",
            "※このメールは自動送信です。このメールへの返信はできません。",
            "",
            "未来商店 (Mirai Shoten)",
        ].join("\n"),
    };

    try {
        await transporter.sendMail(shopMail);
        await transporter.sendMail(replyMail);
        return res.json({ ok: true });
    } catch (err) {
        console.error("メール送信エラー:", err.message);
        return res.status(500).json({ ok: false, error: "メール送信に失敗しました。" });
    }
});

app.listen(PORT, () => {
    console.log(`未来商店サーバー起動: http://localhost:${PORT}`);
});

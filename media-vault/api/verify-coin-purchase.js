import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference, purchaseId } = req.body;
  if (!reference || !purchaseId) {
    return res.status(400).json({ success: false, error: 'Missing reference or purchaseId' });
  }

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackRes.json();
    if (!paystackRes.ok || !paystackData.status) {
      console.error("Paystack verification failed:", paystackData);
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

    const { status, amount } = paystackData.data;
    if (status !== 'success') {
      return res.status(400).json({ success: false, error: 'Payment not successful' });
    }

    const { data: purchase, error: fetchError } = await supabase
      .from('coin_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single();

    if (fetchError || !purchase) {
      return res.status(404).json({ success: false, error: 'Purchase record not found' });
    }

    if (purchase.status === 'paid') {
      return res.status(400).json({ success: false, error: 'Purchase already processed' });
    }

    const expectedKobo = purchase.naira_amount * 100;
    if (amount < expectedKobo) {
      return res.status(400).json({ success: false, error: 'Amount paid is less than expected' });
    }

    await supabase
      .from('coin_purchases')
      .update({ status: 'paid', paystack_reference: reference })
      .eq('id', purchaseId);

    const { data: profile } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', purchase.user_id)
      .single();

    const currentCoins = Number(profile?.coins || 0);
    const newBalance = currentCoins + Number(purchase.coins_requested);

    await supabase
      .from('profiles')
      .update({ coins: newBalance })
      .eq('id', purchase.user_id);

    return res.status(200).json({ success: true, newBalance });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

import { PayPalScriptOptions } from "@paypal/paypal-js";
import { env } from "~/env.mjs";

export const initialOptions: PayPalScriptOptions = {
  "client-id": env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
  // debug: true
};

export const fileStoragePath: string =
  "https://imjsqwufoypzctthvxmr.supabase.co/storage/v1/object/public/auction-assets";

export const charityWaterAuctionId = "6b2300f1-33d9-4210-8ae2-0d80d1cf931a";

export const faq: {
  subject: string;
  questions: { question: string; answer: string }[];
}[] = [
  {
    subject: "HOW DOES GOODBIDS WORK?",
    questions: [
      {
        question: "How does Goodbids work?",
        answer: `Every bid is a donation. We call each donation bid a “Goodbid.” When you Goodbid in an auction, the dollar amount of your Goodbid is donated to the charity hosting the auction.	
    Goodbids runs auctions this way to help charities fundraise faster and more effectively.`,
      },
      {
        question: `What does "Every bid is a donation" mean?`,
        answer: `Exactly that — every time you make a Goodbid, two things happen:
You set the current bidding on the item to the amount you Goodbid.
The full amount of your Goodbid is donated to the charity hosting the auction.
Because Goodbids are donations, they’re tax-deductible to the extent allowed by law.`,
      },
      {
        question: "Can you give me an example?",
        answer: `Sure! If you successfully Goodbid $15 during an auction, the current price of the item becomes $15, and you’ve donated $15 to the charity auction host, regardless of whether you go on to win the item.`,
      },
      {
        question: `What if I Goodbid two or more times during one auction? Do all of my Goodbids count as separate donations?`,
        answer: `Yes. Say you Goodbid $15 during an auction, but then you get outbid by someone bidding $25. You decide to Goodbid $35 to retake the bidding lead.
By doing this, you’ve just donated an additional $35 to the charity auction host, for a total donation so far of $50 — $35 for your current Goodbid + $15 for your earlier Goodbid.`,
      },
      {
        question: `Does “Every bid is a donation” mean charities raise more money?`,
        answer: `Yes! Because every Goodbid is a donation, Goodbids helps you and your community do maximum good for maximum fun. How? By helping charities raise much more money than the retail price of the items they auction. 
For instance, say an auction item retails for $600. The auction starts with a Goodbid of $5 and goes for $175 via bidding increments of $10, the charity auction host brings in $1,620 — that’s more than nine times the winning Goodbid, and more than 2.5 times the retail price.				
Better yet, an item that retails at $6,000 with a $5 starting bid, $10 bidding increments, and a $1,505 maximum bid will raise $102,885 for charity. In other words, a whopping 17 times the item’s retail price!
`,
      },
      {
        question: `Is this a scam?`,
        answer: `Nope. It's not a scam for bidders because Goodbids makes it clear that every Goodbid they make is a donation. Goodbids always asks Goodbidders to set a maximum total spend for each item to ensure that you don't spend more money on an item than you want to. And Goodbids never handles your money — your Goodbid donations flow directly to the charity auction hosts.
It's not a scam for our charity partners because charity auction hosts receive all the money from every Goodbid made in their auctions. `,
      },
      {
        question: `How does the money flow?`,
        answer: `Goodbids donations flow directly to the charity auction host. Goodbids never handles your money.
Goodbids doesn't charge charities for auctions that receive fewer than the minimum bids required for a successful auction. We only charge charities for successful auctions, i.e. auctions that have raised funds for the charity auction host.
`,
      },
      {
        question: `Does Goodbids get a cut?`,
        answer: `Yes. Goodbids is a for-profit company.`,
      },
      {
        question: `How does Goodbids make money?`,
        answer: `Goodbids makes money by charging charities a 6% fee of the total amount raised by the charity through all bids placed in each of the charity's successful auctions.`,
      },
    ],
  },
  {
    subject: "SIGNING UP",
    questions: [
      {
        question: "How do I sign up to become a Goodbidder?",
        answer: `It's really simple! click on "Log in" or "Sign up" above, and either enter your email or sign up with your google account. 
        If you sign up with your email, you won't need to come up with a password - we'll send you a secure link for verification.`,
      },
      {
        question:
          "What’s the minimum age requirement for a Goodbids membership?",
        answer:
          "Because Goodbids auctions involve online transactions, we require all our members to be 18 years of age or older. This protects our charity participants as well as Goodbidders and underage users.",
      },
      {
        question:
          "Can I let a child under the age of 18 use my Goodbids account?",
        answer:
          "Yes, a person under 18 can use your account with your permission. But you are responsible for Goodbids made with your account as the account holder.",
      },
      {
        question: "Do I have to give you my credit card to sign up?",
        answer:
          "No. However, Goodbids must be made using PayPal, either through a PayPal account or through paying with a credit card through PayPal. Whenever you Goodbid, you’ll be taken to PayPal to submit your payment information, and then redirected to Goodbids after your transaction is completed.",
      },
    ],
  },
  {
    subject: "GOODBIDDING ON AUCTION ITEMS",
    questions: [
      {
        question: "How do I place a Goodbid?",
        answer: `On the live auction page, you'll usually see a dark green button, saying what the current GoodBid amount is. 
    Clicking that button will open up a screen offering you a few different methods to pay via paypal. Choose one, fill out your payment info, and once your payment is confirmed, congratulations! 
    You are the current high GoodBidder.`,
      },
      {
        question: "Can I place multiple GoodBids in a row?",
        answer:
          "You are not able to place multiple GoodBids in a row - you have to wait for someone\
       else to place a GoodBid after you before you can place another one.",
      },
      {
        question: "What are the bidding increments?",
        answer: "The bidding increment for all auctions is $10.",
      },
      {
        question: "Can I retract my Goodbids?",
        answer:
          "No, all Goodbids are legal and binding donations to the charity auction host.",
      },
      {
        question: "What currency am I bidding in?",
        answer: "Goodbids are set to U.S. dollars by default.",
      },
    ],
  },
  {
    subject: "PRIVACY POLICY",
    questions: [
      {
        question: "Will you sell my information or track data relating to me?",
        answer: "No. Full-stop. We will never sell your information",
      },
    ],
  },
];

// How do I calculate how much I've spent during one auction?

// On the auction page, you will see a Your Total Spend box which tracks the sum of all your bids so far.

// How can I set a maximum total amount for an item I'm bidding on?

// When you place your first Goodbid on an auction item, you will be asked to set the maximum amount you want to Goodbid on the item, as well as the maximum total amount you want to spend in pursuing the item.

// You will be able to edit both your maximum Goodbid amount and your maximum total spend amount on the auction item page in Your Total Spend box.

// How will Goodbids make sure I don’t go over my Maximum Total Spend mount?
// In addition to always requiring that you set a “Maximum Total Spend” amount whenever you Goodbid, a pop-up box will alert you if a new Goodbid you want to make will put you over the Maximum Total Spend amount you set.

// How do I track an auction?

// If you’ve Goodbid in an auction, it will appear on your Goodbids Fundraising Page.

// If you haven’t Goodbid in an auction, TKTKTK HOW YOU CAN WATCH AN AUCTION.

// How do I know if I’ve won an auction?

// Goodbids will notify you of your win and much rejoicing will ensue!

// How do I know an auction has ended?
// TKTK about how successful auctions end.
// TKTK about how unsuccessful auctions end.
// Can I get a refund for my non-winning Goodbids?
// No — every Goodbid is a donation, and there are no refunds for donations. You and other bidders on Goodbids are helping charities raise more money faster.
// What is the minimum amount a winning Goodbidder has to Goodbid for the auction to be successful?
// An auction is considered successful if the final Goodbid amount has met or surpassed the item’s reserve price by the time the auction expires. See “Reserve Prices” in the Charity Partners FAQ.
// What does “reserve price” mean for an auction item?
// Goodbids sets minimum reserve prices for every auction TKTK. If an item on auction does not achieve the minimum Goodbid amount or minimum number of Goodbids, then the auction is unsuccessful and there are no winners.
// TKTK WHAT THIS MEANS FOR THE GOODBIDS MADE IN THAT AUCTION, SINCE GOODBIDS ARE NOT REFUNDED.
// Who pays for shipping charges?
// Since all Goodbids are donations, shipping charges will be charged to the winning Goodbidder after the auction ends.
// How does the Buy Now option work?
// TKTK.
// Can I donate directly to the charity auction host without bidding on an auction item?
// Yes, Goodbids auction pages include a Donate button TKWHERE ON THE PAGE to allow users to donate directly to your charity without participating in the auction.
// Can I place a Goodbid on behalf of another Goodbidder?
// Yes! Just TKTKTK.
// OR [in the more probable case that we can’t facilitate Goodbidding on behalf of someone else to work through PayPal ===>] No, but you can donate funds to the Goodbidder via their Goodbidder Fundraising Page TKWHERE ON THE PAGE.

// Are donated funds guaranteed to go to the charity hosting the auction?
// Yes. Goodbids guarantees that the total amount of Goodbids made goes to the charity hosting the related auction. Goodbids never handles any money donated by Goodbidders.

// Can I get a refund for my non-winning Goodbids?
// No — every Goodbid is donation, and there are no refunds for donations. You and other bidders on Goodbids are helping charities raise more money faster. In the event that a charity is unable to fulfill a prize that they listed with good intent, the winner may be offered a substituted prize at the discretion of the charity, but no refunds are possible.

// What if I Goodbid multiple times and don’t win any auctions?
// The idea behind Goodbids is that supporting a good cause is its own reward. You might bid often and not win anything. Along the way, you’ve helped charities fund their important work faster and more efficiently. And all of your non-winning Goodbids are tax-deductible to the extent allowed by law. Thanks for coming.

// BIDDING STRATEGY
// Can I bid snipe on Goodbids?

// Bid sniping means swooping in at the last second to place the highest bid before the clock on an auction runs out. Goodbids auctions don’t run on a clock — they only end after a period of time passes without any new Goodbids placed. So bid sniping is a lot harder to do on Goodbids.

// // What is a "topping advantage"?
// // TKTK.

// I WON THE ITEM! NOW WHAT?
// How much of my winning Goodbid goes to my charity?

// 100% of the winning bid goes to your charity as the auction host. Also, 100% of all the previous bids in an auction are donations which go to your charity as the auction host.

// // Can I choose which charity to donate to?

// // No, this is not a feature Goodbids currently offers. Any Goodbid you place is a donation to the charity hosting that particular auction.

// // Will I be charged tax on the winning item?

// // Depending on the state you're [from/bidding from {we'll have to figure this out)], you may need to pay taxes.

// // Will I be charged for shipping?

// // Yes. Your Goodbids, including your winning Goodbid, are donations, so shipping charges are handled separately and are automatically charged when your item is shipped.

// // How do I receive my auction items?

// // OUR FULFILLMENT COMPANY PARTNER handles the shipping of your item to you.

// // Where will my item be shipped?

// // Your shipping address is part of your personal profile information you gave to Goodbids when you signed up for a Goodbids account.

// // What are expected delivery dates for the item I won?

// // Please allow for 5-7 business days for delivery of your item.

// // Can I change my shipping details?

// // To change your shipping address before an item you won is shipped to you, [follow these instructions].

// // How can I track my item?

// // TKTK.

// // Can I ship my auction items to another address as a gift?

// // No, this is not a feature Goodbids currently offers.

// // Can I ship the item out of the United States?

// // At this time, Goodbids winners may only ship items within the United States.

// // Can I return an item for a refund?

// // No, items won are not returnable, and the money you donated to the charity auction host in order to win the item is nonrefundable.

// // How can I get help for an item I haven't received yet?

// // Please call our Goodbids help hotline, and one of our customer service reps will be happy to work with you to resolve the issue.

// // PAYMENT AND SECURITY
// // How does the 6% Goodbids fee work?

// // 100% of the total amount of Goodbids placed in each auction goes to the charity auction host. Goodbids will request 6% of the total donation from the charity auction host’s PayPal account. The charity auction host then has 5 business days to pay the Goodbids fee.
// // What happens if my charity gets behind on its payments to Goodbids?

// // Goodbids will suspend auction hosting privileges for a charity with outstanding PayPal payment requests until the Goodbids fees are paid and the charity’s account is again in good standing.
// // What security measures are in place to protect my charity’s information?

// // We use TKNAME encryption technology to safeguard all of your charity’s online transactions on Goodbids. In addition, we use PayPal for all financial transactions to ensure that Goodbids never houses any of your charity’s sensitive information.

// // YOUR GOODBIDS FUNDRAISING PAGE
// // Where can I find my Goodbids Fundraising Page?
// // TKTK.
// // How do I view my past auctions?
// // Click on “Bidding History” on your Goodbids Fundraising Page. Your Bidding History page will display both the items you successfully bid on, as well as the items you bid on, but did not win. Your Goodbids Fundraising Page will list all of your past auctions in three categories:
// // Live Auctions
// // Successful Auctions
// // Unsuccessful Auctions
// // How do I share my Goodbids Fundraising Page on social media?
// // Easy! Just click on the icon for the social media platform where you want to share your Goodbids Fundraising Page. You’ll be able to write a caption, and tag charities, or relevant vendors and celebrities.
// // You’ll also have the option of including special hashtags designated by you to help spread the word about the charity you’re supporting and/or the project you’re helping fund.

// How do I change the password for my Goodbids account?
// Go to your Goodbids Fundraising Page, and click on “My Profile” in the menu bar. You can edit your password and TKWHATELSE there.

// // SPECIAL PROMOTIONS
// // What is Goodbids Friday?
// // Every Friday, Goodbids will auction juicy items from our clearinghouse to raise money for all of its charity partners.

// // DONATING ITEMS FOR CHARITY AUCTIONS
// // Can I donate items to charity auctions?

// // No, at this time Goodbids and our partner charities do not accept donated items from individuals.

// // —-----

// // NEED TO MOVE THESE INTO PROPER CATEGORIES ABOVE

// // Can Goodbids freeze accounts?
// // Yes. If questions arise, the company will TKTK.
// // Is Goodbids free to sign up?
// // TKTK.
// // How can I be notified about auctions I am interested in?
// // TKTK.
// // Why can’t I place a bid?
// // TKTK.
// // How to close my account?
// // TKTK.

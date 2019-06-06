export interface Performance {
    timestamp: string;
    spent: number;
    auctions: number;
    bids: number;
    wins: number;
    impressions: number;
    clicks: number;
    finishes: number;
    bidRate: number;
    winRate: number;
    displayRate: number;
    ctr: number;
    ecpm: number;
    errors: number;
    errorsRate: number;
    sspIncome: number;
    exchangeFee: number;
    lostImpressions: number;
    lostImpressionsRevenue: number;

    [key: string]: any;
}

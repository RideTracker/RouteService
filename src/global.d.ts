declare type Env = {
    [key: string]: string | undefined;
    
    DATABASE: D1Database;
    BUCKET: R2Bucket;
    
    ENVIRONMENT: "production" | "staging" | "dev";

    DISCORD_WEBHOOKS_CLIENT_ID: string;
    DISCORD_WEBHOOKS_CLIENT_TOKEN: string;
};

declare type CfRequest = {
    [key: string]: any | undefined;

    params: any;
};

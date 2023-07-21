declare type Env = {
    DATABASE: D1Database;
    
    BUCKET: R2Bucket;
    
    ENVIRONMENT: "production" | "staging" | "dev";

    ANALYTICS_SERVICE: Fetcher;
    ANALYTICS_SERVICE_HOST: string;
    ANALYTICS_SERVICE_CLIENT_ID: string;
    ANALYTICS_SERVICE_CLIENT_TOKEN: string;
};

declare type CfRequest = {
    [key: string]: any | undefined;

    params: any;
};

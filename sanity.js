import {
    createClient,
    createCurrentUserHook,
    createPreviewSubscriptionHook
  } from "next-sanity";
  import createImageUrlBuilder from "@sanity/image-url";


  export const config = {
    /**
     * Find your project ID and dataset in `sanity.json` in your studio project.
     * These are considered “public”, but you can use environment variables
     * if you want differ between local dev and production.
     *
     * https://nextjs.org/docs/basic-features/environment-variables
     **/
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-08-11", // or today's date for latest
    /**
     * Set useCdn to `false` if your application require the freshest possible
     * data always (potentially slightly slower and a bit more expensive).
     * Authenticated request (like preview) will always bypass the CDN
     **/
    useCdn: process.env.NODE_ENV === "production",
  };
  
  if (!config.projectId) {
    throw Error(
      "The Project ID is not set. Check your environment variables."
    );
  }
  export const urlFor = source =>
    createImageUrlBuilder(config).image(source);
  
  export const imageBuilder = source =>
    createImageUrlBuilder(config).image(source);
  
  export const usePreviewSubscription =
    createPreviewSubscriptionHook(config);

  export const sanityClient = createClient(config);
  export const useCurrentUser = createCurrentUserHook(config);
  

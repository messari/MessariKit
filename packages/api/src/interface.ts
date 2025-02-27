import {
    getExchangeRankingsRecapResponse,
    getExchangeRecapResponse,
    getExchangeRecapParameters,
    getProjectRecapResponse,
    getProjectRecapParameters,
} from "@messari-kit/types";

/**
 * Interface for the recaps API endpoints
 */
export interface RecapsAPIInterface {
    /**
     * Gets the latest recaps for a given project across all the time periods 1D, 7D, 30D, 90D
     * @param params.project_id The project ID to get the recap for
     * @return The recaps for the given project
     */
    getProjectRecap(params: getProjectRecapParameters): Promise<getProjectRecapResponse>;

    /**
     * Gets the detailed recap for a single exchange. Includes performance summary, volume data, and news items with summaries
     * @param params.exchange_id The exchange ID to get the recap for
     * @return The recap for the given exchange
     */
    getExchangeRecap(params: getExchangeRecapParameters): Promise<getExchangeRecapResponse>;

    /**
     * Gets overall performance summary for all exchanges, their ranking by volume and news items with summaries
     * @return The exchange rankings recap
     */
    getExchangeRankingsRecap(): Promise<getExchangeRankingsRecapResponse>;
}
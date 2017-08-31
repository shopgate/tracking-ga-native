import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProductVariants,
  receiveProductVariants,
  errorProductVariants,
} from '../action-creators';

/**
 * Retrieves product variants from store.
 * @param {string} productId The product ID for which the product variants are requested.
 * @return {Function} A Redux Thunk
 */
const getProductVariants = productId => (dispatch, getState) => {
  const state = getState();
  const cachedData = state.product.variantsByProductId[productId];

  if (!shouldFetchData(cachedData)) {
    return;
  }

  dispatch(requestProductVariants(productId));

  new PipelineRequest('getProductVariants')
    .setInput({ productId })
    .dispatch()
      .then(result => dispatch(receiveProductVariants(productId, result)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductVariants(productId));
      });
};

export default getProductVariants;

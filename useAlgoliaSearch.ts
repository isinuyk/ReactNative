import { useEffect, useMemo } from "react";
import algoliasearch from "algoliasearch/lite";
import { useDispatch, useSelector } from "react-redux";

import {
  clearSearchState,
  getIndicesKeys,
  getSearchAPIKey,
} from "../../../ducks/SearchPage/actions";
import {
  searchAPIKey,
  indicesKeysLoading,
  indicesKeysError,
  indicesKeys,
  searchAPIKeyError,
  searchAPIKeyLoading,
} from "../../../ducks/SearchPage/selectors";
import { useTheme } from "styled-components";
import { SEARCH_TYPES } from "../../../constants";
import { HOMODEA_SEARCH_APP_ID } from "ducks/App/constants";
import GetCurrentEnv from "utils/environments/GetCurrentEnv";
import { EntityTypes, Indices } from "ducks/SearchPage/constants";

interface IProps {
  searchType: SEARCH_TYPES;
}

const useAlgoliaSearch = ({ searchType }: IProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const apiKey = useSelector(searchAPIKey());
  const apiKeyError = useSelector(searchAPIKeyError());
  const apiKeyLoading = useSelector(searchAPIKeyLoading());
  const indices: Indices = useSelector(indicesKeys());
  const indicesError = useSelector(indicesKeysError());
  const indicesLoading = useSelector(indicesKeysLoading());

  useEffect(() => {
    dispatch(getSearchAPIKey(EntityTypes[searchType]));
    dispatch(getIndicesKeys());
    return () => {
      dispatch(clearSearchState());
    };
  }, []);

  const searchClient = useMemo(() => {
    if (apiKey) {
      return algoliasearch(HOMODEA_SEARCH_APP_ID(GetCurrentEnv()), apiKey);
    }
  }, [apiKey]);

  return {
    searchClient,
    theme,
    apiKeyError,
    apiKeyLoading,
    indices,
    indicesError,
    indicesLoading,
  };
};

export default useAlgoliaSearch;

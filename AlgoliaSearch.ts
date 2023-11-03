import { ms, mvs } from "react-native-size-matters";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { InstantSearch } from "react-instantsearch-core";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect } from "react";

import SearchBox from "./components/SearchBox";
import SearchList from "./components/SearchList";
import useAlgoliaSearch from "./useAlgoliaSearch";
import { SEARCH_TYPES } from "../../../constants";
import { courses, events } from "../../../strings";
import SearchInputWrapper from "../../../view/screens/Courses/styled/SearchInputWrapper";

interface IProps {
  route: { params: { searchType: SEARCH_TYPES } };
}

const AlgoliaSearch = ({
  route: {
    params: { searchType },
  },
}: IProps) => {
  const navigation = useNavigation();
  useLayoutEffect(
    useCallback(() => {
      navigation.setOptions({
        title:
          searchType === SEARCH_TYPES.COURSE
            ? courses.searchHeader
            : events.searchHeader,
      });
    }, []),
  );
  const {
    searchClient,
    theme,
    apiKeyError,
    apiKeyLoading,
    indices,
    indicesError,
    indicesLoading,
  } = useAlgoliaSearch({ searchType });

  return (
    <View
      style={{
        backgroundColor: theme.color.background,
        flex: 1,
      }}>
      {searchClient && !!Object.keys(indices).length ? (
        <InstantSearch
          searchClient={searchClient}
          indexName={
            searchType === SEARCH_TYPES.COURSE
              ? indices.courses
              : `${indices.events}_startDate_asc`
          }>
          <SearchInputWrapper>
            <SearchBox />
            <SearchList {...{ searchType }} />
          </SearchInputWrapper>
        </InstantSearch>
      ) : null}
      {apiKeyLoading || indicesLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={"large"} color={theme.color.pink} />
        </View>
      ) : null}
      {apiKeyError || indicesError ? (
        <View style={styles.errorContainer}>
          <Text
            style={{
              fontSize: mvs(18),
              color: theme.color.red,
              textAlign: "center",
            }}>
            Etwas ist schief gelaufen. Bitte versuchen Sie es später noch
            einmal.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: ms(24),
  },
});

export default AlgoliaSearch;

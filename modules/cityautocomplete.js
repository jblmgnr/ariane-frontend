const [loading, setLoading] = useState(false);
const [suggestionsList, setSuggestionsList] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);

export default function cityautocomplete() {
  const dropdownController = useRef(null);
  const searchRef = useRef(null);

  const getSuggestions = useCallback(async (city) => {
    const filterToken = city.toLowerCase();
    console.log("getSuggestions", city);
    if (typeof city !== "string" || city.length < 3) {
      setSuggestionsList(null);
      return;
    }

    setLoading(true);

    const response = await fetch(
      `https://geo.api.gouv.fr/communes?nom=${city}&fields=departement&boost=population&limit=10`
    );
    const items = await response.json();
    const suggestions = items
      .filter((item) => item.nom.includes(items[0].nom))
      .map((item) => ({
        code: item.code,
        nom: item.nom,
      }));
    console.log("suggestions", suggestions);
    setSuggestionsList(suggestions);
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened) => {}, []);

  return (
    <View style={styles.container}>
      <AutocompleteDropdown
        ref={searchRef}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        // initialValue={'1'}
        direction={Platform.select({ ios: "down" })}
        dataSet={suggestionsList}
        onChangeText={getSuggestions}
        onSelectItem={(item) => {
          item && setSelectedItem(item.id);
        }}
        debounce={600}
        suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
        onClear={onClearPress}
        //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
        onOpenSuggestionsList={onOpenSuggestionsList}
        loading={loading}
        useFilter={false} // set false to prevent rerender twice
        textInputProps={{
          placeholder: "Type 3+ letters (dolo...)",
          autoCorrect: false,
          autoCapitalize: "none",
          style: {
            borderRadius: 25,
            backgroundColor: "#383b42",
            color: "#fff",
            paddingLeft: 18,
          },
        }}
        rightButtonsContainerStyle={{
          right: 8,
          height: 30,
          alignSelf: "center",
        }}
        inputContainerStyle={{
          backgroundColor: "#383b42",
          borderRadius: 25,
        }}
        suggestionsListContainerStyle={{
          backgroundColor: "#383b42",
        }}
        containerStyle={{ flexGrow: 1, flexShrink: 1 }}
        renderItem={(item, text) => (
          <Text style={{ color: "#fff", padding: 15 }}>{item.nom}</Text>
        )}
        inputHeight={50}
        showChevron={false}
        closeOnBlur={false}
        //  showClear={false}
      />
      <Text style={{ color: "#668", fontSize: 13 }}>
        Selected item id: {JSON.stringify(selectedItem)}
      </Text>
    </View>
  );
}

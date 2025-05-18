import { View, Image, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors'
//import { services } from "@/constants/mocks/services";
//import { tags } from '@/constants/mocks/services';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import useAverageValoration from '@/hooks/useAverageValoration';
import StarRating from '@/components/StarRating';
import { useServices } from '@/hooks/useServices';
import { useTags } from '@/hooks/useTags';

export default function ServiceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const {services} = useServices();
  const {tags} = useTags();

  const handleServicePress = (id: number) => {
    router.push({
      pathname: '/serviceInfo',
      params: { id },
    })
  }


  return (
    <View style={[styles.background, { backgroundColor: Colors[colorScheme].box }]}>
      <SafeAreaView style={[styles.container]}>

        {/* TOP BAR */}
        <View style={[styles.topBarContainter]}>

          {/* TOP ROW */}
          <View style={[styles.topBarStyle]}>
            <ThemedTextInput
              style={[styles.serchBarInput, { backgroundColor: Colors[colorScheme].background }]}
              placeholder='Serveis'
              placeholderTextColor={Colors.input_text}
              autoCorrect={false}
              autoCapitalize="none"
            ></ThemedTextInput>
            <TouchableOpacity style={[styles.searchBarIconBtn, { backgroundColor: Colors[colorScheme].button }]}>
              <Image
                source={colorScheme === 'dark' ?
                  require('@/assets/images/Icons/search_darkmode.png') :
                  require('@/assets/images/Icons/search_lightmode.png')
                }
                style={[styles.searchBarIcon]}
              />
            </TouchableOpacity>
          </View>

          {/* BOTTOM ROW */}
          <ScrollView
            style={styles.bottomBarScroll}
            contentContainerStyle={[styles.bottomBarStyle]}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            scrollEventThrottle={16}
          >
            <TouchableOpacity
              style={[
                styles.searchBarFilterBtn,
                { backgroundColor: Colors.primari }
              ]}
            >
              <Image
                source={colorScheme === 'dark' ?
                  require('@/assets/images/Icons/filter_darkmode.png') :
                  require('@/assets/images/Icons/filter_lightmode.png')
                }
                style={styles.searchBarFilterIcon}
              />
            </TouchableOpacity>

            {tags?.map((tag, index) => (
              <TouchableOpacity style={[
                styles.searchBarTagBtn,
                { borderColor: Colors[colorScheme].box_border },
                { backgroundColor: Colors.secundari }
              ]}
                key={index}
              >
                <ThemedText style={[{ color: Colors.accent_primari }, { fontSize: 16 }]} type='bold'>{tag.name}</ThemedText>
              </TouchableOpacity>

            ))}

          </ScrollView>
        </View>

        {/* Service cards */}
        <ScrollView
          style={{ backgroundColor: Colors[colorScheme].background }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={{ height: 15 }} />
          {services?.map((service) => {
            const { average, count } = useAverageValoration(service.valorations)
            return (
              <View style={styles.scrollContent} key={service.id}>
                <Link
                  href={{ pathname: '/serviceInfo', params: { id: service.id } }}
                >
                  <TouchableOpacity
                    style={[styles.serviceBox, { backgroundColor: Colors[colorScheme].box }]}
                    onPress={() => handleServicePress(service.id)}
                  >
                    <View style={[styles.serviceImageBox, { backgroundColor: Colors.primari }]}>
                      <Image
                        style={styles.serviceImage}
                        source={
                          typeof service.ad_path === "string" ?
                            { uri: service.ad_path } :
                            service.ad_path
                        }
                      />
                    </View>

                    <View style={styles.serviceInfo}>
                      <View style={styles.serviceTags}>
                        {service.tags.map((tag, index) => (
                          <View style={
                            [styles.tagStyle,
                            { backgroundColor: Colors[colorScheme].background },
                            { borderColor: Colors[colorScheme].box_border }
                            ]} key={index}>

                            <ThemedText
                              style={[{ color: Colors.accent_primari }, { fontSize: 12 }]}
                              type={'bold'}>{tag.name}
                            </ThemedText>
                          </View>
                        ))}
                      </View>

                      {/* Name */}
                      <ThemedText
                        style={styles.serviceNameStyle}
                        type={'bold'}>{service.name}
                      </ThemedText>

                      {/* Rating */}
                      <View
                        style={[styles.serviceRateStyle]}
                      >
                        <StarRating rating={average}></StarRating>
                        <ThemedText type='default' style={styles.ratingCount}>
                          ({count || 0})
                        </ThemedText>
                      </View>

                    </View>

                  </TouchableOpacity>

                </Link>

              </View>

            )

          })}
        </ScrollView>
      </SafeAreaView>
    </View>

  );
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },

  topBarContainter: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    elevation: 5,
  },

  topBarStyle: {
    width: '90%',
    height: '40%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  bottomBarScroll: {
    width: '90%',
    height: '40%',
    alignSelf: 'center',
    flexDirection: 'row',
  },

  bottomBarStyle: {
    height: '70%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    flexDirection: 'row',
  },

  serchBarInput: {
    flex: 1,
    height: '90%',
    borderRadius: 10,
    paddingStart: 16,
    marginRight: 8,
  },

  searchBarIconBtn: {
    flex: 0,
    height: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBarIcon: {
    resizeMode: 'contain',
    height: '100%',
  },

  searchBarFilterBtn: {
    width: 46,
    height: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  searchBarTagBtn: {
    height: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginRight: 8,
    borderWidth: 1,
  },

  searchBarFilterIcon: {
    resizeMode: 'contain',
    height: '100%',
  },

  container: {
    flex: 1,
    width: '100%',
  },

  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 150,
  },

  linkStyle: {
    width: '100%'
  },

  scrollContent: {
    marginVertical: 16,
    alignItems: 'center',
    alignContent: 'center',
    width: '90%'
  },

  serviceBox: {
    height: 120,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 20,
  },

  serviceImageBox: {
    width: '33%',
    borderStartStartRadius: 20,
    borderBottomStartRadius: 20,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  serviceImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },

  serviceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  serviceTags: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  tagStyle: {
    marginTop: 4,
    marginLeft: 8,
    paddingHorizontal: 8,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  serviceNameStyle: {
    fontSize: 20,
    paddingLeft: 8,
    paddingTop: 8,
  },

  serviceRateStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 8,
  },
  ratingCount: {
    fontSize: 12,
    marginLeft: 8,
    textAlignVertical: 'top',
  },
});

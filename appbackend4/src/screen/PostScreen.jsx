import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/spacing";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Post from "../components/Post";
import { useUser } from "../hooks/userUser";

export default function PostScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { top } = useSafeAreaInsets();
  const [post, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {exit, token} = useUser();

  const getPosts = async () => {
    try {
      const { data } = await axios.get("/post/user", {headers:{Authorization: `Bearer ${token}`}});
      console.log(data.data);
      setPosts(data.data);
    } catch (error) {
      console.log("Error en el getPosts", error.message);
    }
  };

  useEffect(() => {
    isFocused && getPosts();
  }, [isFocused]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getPosts();
    setIsRefreshing(false);
  }, []);

  return (
    <>
      <View style={{ ...styles.container, top: top + 15 }}>
        <Text style={styles.title}>Quiz</Text>
        <Text style={styles.subtitle}>Posts</Text>

        <TouchableOpacity
          style={{ ...styles.button, top }}
          onPress={() => navigation.navigate("PostActionScreen")}
        >
          <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="add-circle-outline"
              color={colors.light}
              size={30}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.button }}
          onPress={() => exit()}
        >
          <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="exit-outline"
              color={colors.light}
              size={30}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* listar todos los posts */}
      <FlatList
        data={post}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.light]}
            progressBackgroundColor={colors["dark-gray"]}
          />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },

  title: {
    color: colors.white,
    fontSize: SPACING * 5,
    fontWeight: "700",
  },

  subtitle: {
    color: colors.light,
    marginTop: SPACING / 2,
  },

  button: {
    overflow: "hidden",
    borderRadius: 5,
    position: "absolute",
    right: 0,
  },

  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});

import {Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/spacing";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useUser } from "../hooks/userUser";

const screenHeight = Dimensions.get("screen").height;

export default function DetailScreen({route}) {
  const {token} = useUser()
  const id = route.params;
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  const [post, setPost] = useState({});

  const getPost = async () => {
    try {
      setIsLoading(true)
      const {data} = await axios.get(`/post/${id}`, {headers:{Authorization:`Bearer ${token}`}});
      setPost(data.data);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log("Error en GetPost", error.message)
    }
  };

  useEffect(() => {
    isFocused && getPost()
  }, [isFocused]);

  const deletePost = async () => {
    try {
      setIsRemoving(true)
      const {data} = await axios.delete(`/post/${post._id}`, {headers:{Authorization:`Bearer ${token}`}})
      setIsRemoving(false)
      navigation.navigate("HomeScreen")
    } catch (error) {
      setIsRemoving(false)
      console.log("error en el deletePost", error.message)
    }
  }

  if(isLoading || isRemoving){
    return(
      <View style = {{flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color = "red" size = {80}/>
      </View>
    )
  }

  return (
    <ScrollView>
      <View style = {styles.imageContainer}>
        <View style = {styles.imageBorder}>
          <Image source = {{ uri: post.imgUrl }}
          styles = {styles.image}/>
        </View>
      </View>

      <View style = {{marginTop: 20}}>
        <Text style = {styles.title}>{post.title}</Text>
        <Text style = {styles.subtitle}>{post.description}</Text>
      </View>

      <View style = {styles.buttonsContainer}>
        <TouchableOpacity style = {styles.buttonRadius} onPress={() => navigation.navigate("PostActionScreen", post)}>
        <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="create-outline"
              color={colors.light}
              size={SPACING * 2}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style = {styles.buttonRadius} onPress={() => deletePost()}>
        <LinearGradient
            style={styles.gradient}
            colors={[colors["dark-gray"], colors.dark]}
          >
            <Ionicons
              name="trash-outline"
              color={colors.light}
              size={SPACING * 2}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* boton back-atras */}

      <TouchableOpacity style = {styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back-outline"
              color={"white"}
              size={SPACING * 6}
            />
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: screenHeight * 0.7,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },

  imageBorder: {
    flex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },

  image: {
    flex: 1,
  },

  title: {
    color: colors.light,
    fontSize: SPACING * 2,
    fontWeight: "bold",
  },

  subtitle: {
    color: colors.light,
  },

  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },

  buttonsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignposts: "center",
  },

  buttonRadius: {
    overflow: "hidden",
    borderRadius: SPACING / 2,
  },

  gradient: {
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 3,
  },
});
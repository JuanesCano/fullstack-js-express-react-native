import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Button} from "react-native";
import React, { useState } from "react";
import { colors } from "../config/colors";
import { SPACING } from "../config/spacing";
import * as yup from "yup";
import { Formik } from "formik";
import FormContainer from "../components/Form/FormContainer";
import FormInput from "../components/Form/FormInput";
import * as ImagePicker from "expo-image-picker";
import FormSubmitButton from "../components/Form/FormSubmitButton";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../hooks/userUser";

const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Titulo invalido")
    .required("Titulo es requerido"),

  description: yup
    .string()
    .trim()
    .min(3, "description invalido")
});

export default function PostActionsScreen({route}) {
  const { token } = useUser();
  const post = route.params
  const [image, setImage] = useState(post?.imgUrl || null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const postInfo = {
    title: post?.title || "",
    description: post?.description || "",
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // if (result.assets && result.assets.length > 0) {
      //   const selectedImage = result.assets[0];
      //   const uri = selectedImage.uri;
      //   const width = selectedImage.width;
      //   const height = selectedImage.height;
        // Realiza las operaciones necesarias con la imagen seleccionada...
      // }
    } else {
      alert("You did not select any image.");
    }
  };

  const savePost = async (formData) => {
    try {
      const { title, description } = values;
      const formData = new FormData();

      if (image) {
        formData.append("img", {
          name: image.split("/").pop(),
          uri: image,
          type: "image/jpg",
        });
      };

      formData.append("title", title);
      formData.append("description", description);
      setIsLoading(true);

      await axios.post("/post", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization:`Bearer ${token}`
        },
      });

      setIsLoading(false);
      formikActions.resetForm();
      formikActions.setSubmitting(false);
    } catch (error) {
      console.log("Error en savePost", error.message);
    }
  };

  const updatePost = async (formData) => {
    try {
      const { title, description } = values;
      const formData = new FormData();

      if (post.imgUrl !== image) {
        formData.append("img", {
          name: image.split("/").pop(),
          uri: image,
          type: "image/jpg",
        });
      }

      formData.append("title", title);
      formData.append("description", description);

      setIsLoading(true)

      await axios.put(`/post/${post._id}`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization:`Bearer ${token}`
        },
      });

      setIsLoading(false)
      formikActions.resetForm();
      formikActions.setSubmitting(false);
    } catch (error) {
      setIsLoading(false)
      console.log("Error en updatePost", error.message);
    }
  };
  

  const actions = async (values, formikActions) => {

    post 
    ? await updatePost(values, formikActions) 
    : await savePost(values, formikActions) 

    navigation.goBack();
  };

  if(isLoading){
    return(
      <View style = {{flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color = "red" size = {80}/>
      </View>
    )
  };

  return (
    <>
      <View style={styles.container}>
        <FormContainer>
          <Formik
            initialValues={postInfo}
            validationSchema={validationSchema}
            onSubmit={actions}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => {
              const { title, description } = values;
              return (
                <>
                  <FormInput
                    value={title}
                    error={touched.title && errors.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("titulo")}
                    label="Titulo"
                    placeholder="Titulo"
                  />

                  <FormInput
                    value={description}
                    error={touched.description && errors.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    label="Description"
                    placeholder="Description"
                  />

                  <View>
                    <TouchableOpacity
                      style={styles.uploadBtnContainer}
                      onPress={() => pickImage()}
                    >
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Text style={styles.uploadBtn}>
                          {" "}
                          Seleccionar imagen{" "}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Button
                    submitting={isSubmitting}
                    onPress={handleSubmit}
                    title={ post? "Actualizar" : "Guardar"}
                  />
                </>
              );
            }}
          </Formik>
        </FormContainer>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
  },

  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 60,
    borderColor: colors.light,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 10,
    // marginLeft: 100,
  },

  uploadBtn: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.3,
    fontWeight: "bold",
    color: colors.light,
  },

  backButton: {
    position: "absolute",
    top: 30,
    left: 5,
  },
});

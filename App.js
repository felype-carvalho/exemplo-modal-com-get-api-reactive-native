import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import Constants from 'expo-constants';

async function executeGet(url, jsonState) {
  //get síncrono com o uso do fetch
  await fetch(url)
    .then((response) => {
      if (response.status === 200) {
        console.log('sucesso');
        response.json().then(function (result) {
          console.log(result);
          jsonState(result);
        });
      } else {
        throw new Error('Erro ao consumir a API!');
      }
    })
    .then((response) => {
      //console.debug(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

const ShowDetalhes = ({ display, toogleModal, categoria, descricao }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={display}
    onRequestClose={toogleModal}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Pressable onPress={toogleModal}>
          <Text style={styles.paragraphCategoria}>{categoria}</Text>
          <Text style={styles.paragraphDescricao}>{descricao}</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const Produto = ({ titulo, preco, categoria, descricao, imagem }) => {
  //state para controle do Modal
  const [modal, setModal] = React.useState(false);

  function mudaModal() {
    setModal(!modal);
  }

  return (
    <View>
      <ShowDetalhes
        display={modal}
        toogleModal={mudaModal}
        categoria={categoria}
        descricao={descricao}
      />

      <Pressable onPress={mudaModal}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: imagem,
          }}
        />

        <Text style={styles.paragraphTitle}>{titulo}</Text>
        <Text style={styles.paragraphPrice}>{preco}</Text>
      </Pressable>
    </View>
  );
};

//item com uma arrow function
/*const meuItemObj = ({item}) => (
  <View>
      <Text style={styles.paragraph}>{item.title}</Text>
    </View>
)*/

export default function App() {
  const [jsonData, setJsonData] = React.useState({});

  executeGet('https://fakestoreapi.com/products/', setJsonData);

  //função que renderiza cada item do FlatList
  function meuItem({ item }) {
    //let nomeCompleto = item.first_name + " " + item.last_name
    let precoReal = 'R$ ' + item.price;

    return (
      <Produto
        titulo={item.title}
        preco={precoReal}
        descricao={item.description}
        categoria={item.category}
        imagem={item.image}
      />
    );
  }
  //titulo, preco, categoria, descricao, imagem

  return (
    <View style={styles.container}>
      <FlatList
        data={jsonData}
        renderItem={meuItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#b4ffff',
    padding: 8,
  },
  paragraphTitle: {
    margin: 12,
    marginBottom: 0,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#80deea',
    borderRadius: 5,
  },
  paragraphPrice: {
    margin: 12,
    marginTop: 0,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#4bacb8',
    borderRadius: 5,
  },
  paragraphDescricao: {
    fontSize: 18,
    textAlign: 'justify'
  },
  paragraphCategoria: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15
  },
  tinyLogo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

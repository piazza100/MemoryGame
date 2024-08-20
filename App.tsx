import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Button } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { Picker } from '@react-native-picker/picker';

const emojiThemes = {
  fruits: [
    { id: 1, image: '🍎' },
    { id: 2, image: '🍊' },
    { id: 3, image: '🍇' },
    { id: 4, image: '🍓' },
    { id: 5, image: '🍍' },
    { id: 6, image: '🍉' },
    { id: 7, image: '🍌' },
    { id: 8, image: '🍒' },
  ],
  monsters: [
    { id: 1, image: '👹' },
    { id: 2, image: '👺' },
    { id: 3, image: '👻' },
    { id: 4, image: '👾' },
    { id: 5, image: '💀' },
    { id: 6, image: '😈' },
    { id: 7, image: '🤡' },
    { id: 8, image: '👽' },
  ],
  animals: [
    { id: 1, image: '🐶' },
    { id: 2, image: '🐱' },
    { id: 3, image: '🐭' },
    { id: 4, image: '🐹' },
    { id: 5, image: '🐰' },
    { id: 6, image: '🦊' },
    { id: 7, image: '🐻' },
    { id: 8, image: '🐼' },
  ],
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryGame = () => {
  const [selectedTheme, setSelectedTheme] = useState('fruits');
  const [pairCount, setPairCount] = useState(2);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [disableAllCards, setDisableAllCards] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    startNewGame();
  }, [selectedTheme, pairCount]);

  const startNewGame = () => {
    const selectedCards = emojiThemes[selectedTheme].slice(0, pairCount);
    const shuffledCards = shuffleArray([...selectedCards, ...selectedCards]);
    setCards(shuffledCards.map((card, index) => ({ ...card, index })));
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setIsGameOver(false);
    setDisableAllCards(false);
    setShowFireworks(false); // Restart 시 애니메이션 숨김
  };

  const flipCard = (index) => {
    if (disableAllCards || flippedCards.includes(index) || matchedCards.includes(cards[index].id)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setDisableAllCards(true);

      const firstCard = cards[newFlippedCards[0]];
      const secondCard = cards[newFlippedCards[1]];

      if (firstCard.id === secondCard.id) {
        setMatchedCards([...matchedCards, firstCard.id]);

        if (matchedCards.length + 1 === pairCount) {
          setIsGameOver(true);
          setShowFireworks(true); // 애니메이션을 표시
        }

        setTimeout(() => {
          setFlippedCards([]);
          setDisableAllCards(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setDisableAllCards(false);
        }, 1000);
      }

      setMoves(moves + 1);
    }
  };

  const renderCard = ({ item }) => {
    const isFlipped = flippedCards.includes(item.index) || matchedCards.includes(item.id);

    return (
      <TouchableOpacity onPress={() => flipCard(item.index)} style={styles.cardContainer}>
        <Animatable.View
          style={[
            styles.card,
            isFlipped ? styles.flippedCard : {},
            { backfaceVisibility: 'hidden' }
          ]}
          animation={isFlipped ? 'flipInY' : undefined}
          duration={800}
        >
          <Text style={styles.cardText}>{isFlipped ? item.image : '?'}</Text>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Matching Game</Text>

      {/* 이모티콘 테마 선택 */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>테마:</Text>
        <Picker
          selectedValue={selectedTheme}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTheme(itemValue)}
        >
          <Picker.Item label="과일" value="fruits" />
          <Picker.Item label="괴물" value="monsters" />
          <Picker.Item label="동물" value="animals" />
        </Picker>
      </View>

      {/* 카드 쌍 수 선택 */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>카드 쌍:</Text>
        <Picker
          selectedValue={pairCount}
          style={styles.picker}
          onValueChange={(itemValue) => setPairCount(itemValue)}
        >
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="6" value={6} />
          <Picker.Item label="7" value={7} />
          <Picker.Item label="8" value={8} />
        </Picker>
      </View>

      <Text style={styles.moves}>Moves: {moves}</Text>

      {/* 카드와 버튼을 같은 View 안에 넣습니다 */}
      <View style={styles.gameArea}>
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.index.toString()}
          numColumns={4}
          contentContainerStyle={styles.grid}
        />

        <Button title="Restart Game" onPress={startNewGame} style={styles.restartButton} />
      </View>

      {showFireworks && (
        <LottieView
          source={require('./assets/fireworks.json')}
          autoPlay
          loop={false}
          style={styles.fireworks}
          onAnimationFinish={() => setShowFireworks(false)} // 애니메이션이 끝나면 제거
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    width: 150,
  },
  cardContainer: {
    width: Dimensions.get('window').width / 4 - 20,
    height: Dimensions.get('window').width / 4 - 20,
    margin: 10,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  flippedCard: {
    backgroundColor: '#ddd',
  },
  cardText: {
    fontSize: 30,
  },
  moves: {
    fontSize: 18,
    marginVertical: 10,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
  },
  grid: {
    alignItems: 'center',
  },
  restartButton: {
    marginTop: 20,
  },
  fireworks: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});

export default MemoryGame;

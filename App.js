import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import  { useFonts } from 'expo-font';


function CalculatorScreen() {

  const [loaded] = useFonts({
    Helvetica: require('./assets/fonts/Helvetica.ttf'),
  })
  
  const [inputDisplay, setInputDisplay] = useState('1954');
  const [operator, setOperator] = useState('');
  const [previousInput, setPreviousInput] = useState('');
  const [inputNeedsToClear, setInputNeedsToClear] = useState(false);

  const insets = useSafeAreaInsets();

  function Button ({ children, color, onClick: onPressHandler }) {
    const buttonColor = `${color}Button`;
    const buttonText = `buttonText${color === 'yellow' ? 'Yellow' : ''}` 
    return (
      <TouchableOpacity
      style={styles[buttonColor]}
      onPress={onPressHandler}
    >
      <Text style={styles[buttonText]}>{children}</Text>
    </TouchableOpacity>
    )
  }

  function santizeInput (pre, digit) {
    if (digit === '.' && pre.includes('.')) {
      return pre;
    }
    if (pre.length > 14) {
      return pre;
    }
    return pre + digit;
  }

  function onDigitClick (digit) {
    return function () {
      if (inputNeedsToClear) {
        setInputNeedsToClear(false);
        setInputDisplay(digit);
      } else {
        setInputDisplay(pre => santizeInput(pre, digit));
      }
    }
  }

  function reverseInput () {
    setInputDisplay(pre => pre[0] === '-' ? pre.slice(1) :'-' + pre);
  }

  function onPercentage () {
    setInputDisplay(pre => pre / 100);
  }

  function onOperatorClick (_operator) {
    return function () {
      if (previousInput && operator && inputDisplay) {
        const result = eval(previousInput + operator + inputDisplay);
        setInputDisplay(result);
        setOperator(_operator);
        setPreviousInput(result)
        setInputNeedsToClear(true);
      } else {
        setOperator(_operator);
        setPreviousInput(inputDisplay);
        setInputNeedsToClear(true);
      }
    }
  }

  function clearEveryThing () {
    setInputDisplay('');
    setOperator('');
    setPreviousInput('');
    setInputNeedsToClear(false);
  }

  function displayResult (result) {
    setInputDisplay(result);
    setOperator('');
    setPreviousInput('');
  }

  function onEqualTo () {
    if (operator && previousInput && inputDisplay) {
      const result = eval(previousInput + operator + inputDisplay );
      displayResult(result);
    }
  }

  const inputFormatted = inputDisplay;

  if(!loaded) return;

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ScrollView style={styles.scrollInputView} contentContainerStyle={styles.scrollViewContainer}>
            <Text style={styles.inputDisplay}>
              {inputFormatted}
            </Text>
          </ScrollView>

        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
           
            <Button color='grey' onClick={clearEveryThing}> { !inputDisplay ? 'AC' : 'C' } </Button>
            <Button color='grey' onClick={reverseInput}> +/- </Button>
            <Button color='grey' onClick={onPercentage}> % </Button>
            <Button color='yellow' onClick={onOperatorClick('/')}> &#247; </Button>

          </View>
          <View style={styles.buttonRow}>
            <Button color='' onClick={onDigitClick('7')}> 7 </Button>
            <Button color='' onClick={onDigitClick('8')}> 8 </Button>
            <Button color='' onClick={onDigitClick('9')}> 9 </Button>
            <Button color='yellow' onClick={onOperatorClick('*')}> &#215; </Button>
          </View>
          <View style={styles.buttonRow}>
            <Button color='' onClick={onDigitClick('4')}> 4 </Button>
            <Button color='' onClick={onDigitClick('5')}> 5 </Button>
            <Button color='' onClick={onDigitClick('6')}> 6 </Button>
            <Button color='yellow' onClick={onOperatorClick('-')}> &#8722; </Button>
          </View>
          <View style={styles.buttonRow}>
            <Button color='' onClick={onDigitClick('1')}> 1 </Button>
            <Button color='' onClick={onDigitClick('2')}> 2 </Button>
            <Button color='' onClick={onDigitClick('3')}> 3 </Button>
            <Button color='yellow' onClick={onOperatorClick('+')}> + </Button>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.dualButton}
              onPress={onDigitClick('0')}
            >
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>

            <Button color='' onClick={onDigitClick('.')}> . </Button>
            <Button color='yellow' onClick={onEqualTo}> = </Button>
          </View>
        </View>
      </View>
    </View>
  );

}

export default function App() {

  return (
    <SafeAreaProvider>
      <CalculatorScreen />
    </SafeAreaProvider>
  );
}

const { width, height } = Dimensions.get('window');

const calucatedCircleWidth = (width / 4) - 15;
const calucatedCircleHeight = ((height / 100) * 70 / 5) - 15;
const circleLength = Math.min(calucatedCircleWidth, calucatedCircleHeight);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  white: {
    color: '#fff',
  },
  inputContainer: {
    flex: 3,
    overflow: 'scroll',
    justifyContent: 'flex-end',
  },
  inputDisplay: {
    color: 'white',
    fontSize: ((height / 100) * 30) / 3.2,
    textAlign: 'right',
    paddingRight: (width - (circleLength * 4)) / 5 + 15,
    paddingLeft: (width - (circleLength * 4)) / 5 + 15,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  scrollInputView: {
    height: (height / 100) * 30,
  },
  buttonContainer: {
    flex: 7,
  },
  buttonRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  greyButton: {
    backgroundColor: '#949494',
    width: circleLength,
    height: circleLength,
    borderRadius: circleLength / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yellowButton: {
    width: circleLength,
    height: circleLength,
    borderRadius: circleLength / 2,
    backgroundColor: '#FD8D0E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    width: circleLength,
    height: circleLength,
    borderRadius: circleLength / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333'
  },
  dualButton: {
    width: (circleLength * 2) + (width - (circleLength * 4)) / 5,
    height: circleLength,
    borderRadius: circleLength / 2,
    justifyContent: 'center',
    paddingLeft: circleLength / 2 - 15,
    backgroundColor: '#333'
  },
  buttonText: {
    color: '#fff',
    fontSize: circleLength / 2,
    fontFamily: 'Helvetica',
  },
  buttonTextYellow: {
    color: '#fff',
    fontSize: circleLength / 1.8,
    fontFamily: 'Helvetica',
  }
});

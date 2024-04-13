import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  StopWatch: undefined;
  StopWatch2: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'StopWatch'>;
};

const App: React.FC<Props> = ({ navigation }) => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [savedTimes, setSavedTimes] = useState<number[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  let interval: ReturnType<typeof setInterval> | undefined;

  useEffect(() => {
      if (isActive) {
        const startTime = Date.now() - milliseconds;
        interval = setInterval(() => {
          setMilliseconds(Date.now() - startTime);
        }, 10);
      } else if (!isActive && interval) {
        clearInterval(interval);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isActive, milliseconds]);

    const handleStartStop = () => {
      if (!isActive) {
        setHasStarted(true);
      }
      setIsActive(!isActive);
    };

    const handleLapOrReset = () => {
      if (!isActive && hasStarted) {
        setMilliseconds(0);
        setSavedTimes([]);
        setHasStarted(false);
      } else if (isActive) {
        setSavedTimes([...savedTimes, milliseconds]);
      }
    };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(2, '0')}`;
  };

  const renderSavedTime = ({ item }: { item: number }) => (
    <Text style={styles.lapText}>
      {formatTime(item)}
    </Text>
  );

   return (
       <View style={styles.container}>
         <View style={styles.outer}>
         <Text style={styles.timerText}>{formatTime(milliseconds)}</Text>
         </View>
         <View style={styles.inner}>
         <View style={styles.buttonsContainer}>
           <TouchableOpacity
                        style={[styles.button, { backgroundColor: hasStarted && !isActive ? 'grey' : '#D3D3D3' }]}
                        onPress={handleLapOrReset}
                        disabled={!hasStarted}
                      >
                        <Text style={styles.buttonText}>{isActive || !hasStarted ? 'Lap' : 'Reset'}</Text>
                      </TouchableOpacity>
           <TouchableOpacity
             style={[styles.button, { backgroundColor: isActive ? 'red' : 'green' }]}
             onPress={handleStartStop}
           >
             <Text style={styles.buttonText}>{isActive ? 'Stop' : 'Start'}</Text>
           </TouchableOpacity>

         </View>
         <ScrollView style={styles.lapsContainer}>
           {savedTimes.map((lapTime, index) => (
             <Text key={index} style={styles.lapText}>
               Lap {index + 1}: {formatTime(lapTime)}
             </Text>
           ))}
         </ScrollView>

         </View>
       </View>
     );
   };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'black',
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inner: {
      flex: 2,
      justifyContent: 'space-between',

  },
  timerText: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    width: 75,
    height: 75,
    borderRadius: 37.5, // Half the width and height to make it round
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  lapsContainer: {
    flex: 1, // Take up remaining space
    marginTop: 20,
  },
  lapText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },

});

export default App;
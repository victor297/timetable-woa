import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const Stack = createStackNavigator();
const RecommendationScreen = () => {
  // ... Implementation of RecommendationScreen
  const [event, setEvent] = useState("tutorials");
  const [course, setCourse] = useState("csc111");
  const [hour, setHour] = useState("2");
  const [score, setScore] = useState("100");
  const [scoreObtained, setScoreObtained] = useState("50");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  console.log("event", event);
  console.log("course", course);
  console.log("hour", hour);
  console.log("score", score);
  console.log("scoreObtained", scoreObtained);
  const API_URL = "https://openrecomend.vercel.app/api";
  const onSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const response = await fetch(`${API_URL}/generate-gifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hour, event, course, scoreObtained, score }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (e) {
      Alert.alert("Couldn't generate recomendations", e.message);
    } finally {
      setLoading(false);
    }
  };

  const onTryAgain = () => {
    setResult("");
  };
  const getRandomSentence = (original) => {
    const words = original.split(" ");
    const randomWords = words.map((word) => {
      if (word.length > 2) {
        const randomWord = word[Math.floor(Math.random() * word.length)];
        return randomWord + word.slice(1);
      }
      return word;
    });
    return randomWords.join(" ");
  };

  const [randomSentences, setRandomSentences] = useState([]);

  const generatewoa = () => {
    const generatedSentences = [];
    for (let i = 0; i < 25; i++) {
      generatedSentences.push(getRandomSentence(result));
    }
    setRandomSentences(generatedSentences);
  };
  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Here are some recomendations for you</Text>
          <Text style={styles.result}>{result}</Text>
          <Pressable
            onPress={onTryAgain}
            style={[styles.button, { width: "auto" }]}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Not satisfied? Click me
            </Text>
          </Pressable>
          <View>
            <Button
              title='unoptimized WOA result'
              color='green'
              onPress={generatewoa}
            />
            <View>
              {randomSentences.map((sentence, index) => (
                <Text key={index}>{sentence}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.label}>Having study issues??</Text>
          <View style={styles.selectorContainer}>
            <Text
              onPress={() => setEvent("class")}
              style={[
                styles.selector,
                event === "class" && { backgroundColor: "#10a37f" },
              ]}
            >
              class
            </Text>
            <Text
              onPress={() => setEvent("tutorial")}
              style={[
                styles.selector,
                event === "tutorial" && { backgroundColor: "#10a37f" },
              ]}
            >
              tutorials
            </Text>
          </View>

          <Text style={styles.label}>Course</Text>
          <TextInput
            placeholder='Course'
            style={styles.input}
            value={course}
            onChangeText={(s) => setCourse(s)}
          />
          <Text style={styles.label}>how many hour(s) do spend?</Text>
          <TextInput
            placeholder='events hour'
            keyboardType='numeric'
            style={styles.input}
            value={hour.toString()}
            onChangeText={(s) => setHour(s)}
          />
          <Text style={styles.label}>highest obtainable score</Text>
          <TextInput
            placeholder='obtainable score'
            keyboardType='numeric'
            style={styles.input}
            value={score.toString()}
            onChangeText={(s) => setScore(s)}
          />
          <Text style={styles.label}>obtained score</Text>
          <TextInput
            placeholder='score obtained'
            keyboardType='numeric'
            style={styles.input}
            value={scoreObtained.toString()}
            onChangeText={(s) => setScoreObtained(s)}
          />

          <Pressable onPress={onSubmit} style={[styles.button, { width: 300 }]}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              get advice and recomendations
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const optimizewoa = () => {
  const runWhalesOptimization = () => {
    const timetableCopy = JSON.parse(JSON.stringify(timetable));

    const optimizedTimetable = woa(timetableCopy, woaIterations);

    const bestSolutionsByLevel = optimizedTimetable.reduce(
      (solutions, item) => {
        if (!solutions[item.level]) {
          solutions[item.level] = [];
        }
        solutions[item.level].push(item);
        return solutions;
      },
      {}
    );

    const formattedSolutionsByLevel = {};
    for (const level in bestSolutionsByLevel) {
      const formattedSolutions = bestSolutionsByLevel[level].map((item) => ({
        ...item,
        startDateTime: item.startDateTime.toLocaleString(),
        endDateTime: item.endDateTime.toLocaleString(),
      }));
      formattedSolutionsByLevel[level] = formattedSolutions;
    }

    setBestSolutions(formattedSolutionsByLevel);
    // console.log(bestSolutions);
  };

  const woa = (timetable, iterations) => {
    const population = [];
    for (let i = 0; i < 50; i++) {
      const newSolution = generateRandomSolution(timetable);
      population.push(newSolution);
      // console.log(newSolution);
    }

    let bestSolution = population[0];

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < population.length; i++) {
        const solution = population[i];
        const a = 2 - iter * (2 / iterations);

        for (let j = 0; j < timetable.length; j++) {
          const course = timetable[j];
          const randomWhale =
            population[Math.floor(Math.random() * population.length)];

          if (solution.level !== randomWhale.level) continue;

          const newStartTime = course.startDateTime;
          let thenewdate =
            course.startDateTime +
            (randomWhale.startDateTime -
              a * Math.abs(randomWhale.endDateTime - course.endDateTime));
          const newEndTime = course.endDateTime;
          thenewdate =
            course.endDateTime +
            (randomWhale.endDateTime -
              a * Math.abs(randomWhale.endDateTime - course.endDateTime));

          if (
            !isTimeClash(
              newStartTime,
              newEndTime,
              course.startDateTime,
              course.endDateTime
            )
          ) {
            timetable[j].startDateTime = newStartTime;
            timetable[j].endDateTime = newEndTime;

            if (fitness(timetable[j]) > fitness(bestSolution)) {
              bestSolution = timetable[j];
            }
          }
        }
      }
    }

    return timetable;
  };

  const generateRandomSolution = (timetable) => {
    const randomTimetable = [];

    for (let i = 0; i < timetable.length; i++) {
      const course = timetable[i];
      const newStartTime =
        course.startDateTime + Math.random() * (5 * 60 * 60 * 1000);
      const newEndTime =
        newStartTime + (course.endDateTime - course.startDateTime);

      randomTimetable.push({
        ...course,
        startDateTime: newStartTime,
        endDateTime: newEndTime,
      });
    }

    return randomTimetable;
  };

  const fitness = (solution) => {
    let score = 0;
    for (let i = 0; i < solution.length; i++) {
      const course = solution[i];

      if (
        isTimeClash(
          course.startDateTime,
          course.endDateTime,
          course.startDateTime,
          course.endDateTime
        )
      ) {
        score++;
      }
    }
    return score;
  };
};

const EventCheckScreen = () => {
  const [completedEvents, setCompletedEvents] = useState({}); // New state for completed events
  const [todos, setTodos1] = useState([]);
  console.log(todos);
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos1(JSON.parse(storedTodos));
          console.log("checked todo", storedTodos);
        }
      } catch (error) {
        console.log("Error loading todos:", error);
      }
    };
    loadTodos();
  }, []);

  useEffect(() => {
    const loadCompletedEvents = async () => {
      try {
        const storedCompletedEvents = await AsyncStorage.getItem(
          "completedEvents"
        );
        if (storedCompletedEvents) {
          setCompletedEvents(JSON.parse(storedCompletedEvents));
        }
      } catch (error) {
        console.log("Error loading completed events:", error);
      }
    };
    loadCompletedEvents();
  }, []);

  // Function to save completed events in AsyncStorage
  const saveCompletedEventsToStorage = async () => {
    try {
      await AsyncStorage.setItem(
        "completedEvents",
        JSON.stringify(completedEvents)
      );
    } catch (error) {
      console.log("Error saving completed events:", error);
    }
  };

  // Function to mark an event as completed
  const markEventAsCompleted = (eventId) => {
    const updatedCompletedEvents = { ...completedEvents };
    updatedCompletedEvents[eventId] = {
      completed: true,
      timeSpent: 0, // Initialize with 0 hours
    };
    setCompletedEvents(updatedCompletedEvents);
    saveCompletedEventsToStorage(); // Save in AsyncStorage
  };

  // Function to update time spent for a completed event
  const updateEventTime = (eventId, timeSpent) => {
    const updatedCompletedEvents = { ...completedEvents };
    updatedCompletedEvents[eventId].timeSpent = timeSpent;
    setCompletedEvents(updatedCompletedEvents);
    saveCompletedEventsToStorage(); // Save in AsyncStorage
  };
  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => (
        <View>
          <Text style={styles.text}>{item.course}</Text>
          {/* ... other details */}
          {completedEvents[item.id] ? (
            <View>
              <Text style={styles.text}>
                Time Spent: {completedEvents[item.id].timeSpent} hrs
              </Text>
              {!completedEvents[item.id].timeSpent && (
                <TextInput
                  style={styles.input}
                  placeholder='Time Spent (hrs)'
                  keyboardType='numeric'
                  onChangeText={(text) => updateEventTime(item.id, text)}
                />
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, { width: "auto" }]}
              onPress={() => markEventAsCompleted(item.id)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Mark as Completed
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
const TodoScreen = ({ route, navigation }) => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  console.log("normal todo", todos);
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.log("Error loading todos:", error);
      }
    };
    loadTodos();
  }, []);

  const addTodo = async () => {
    const newTodo = {
      id: Math.random().toString(),
      course: selectedCourse,
      time: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      ),
    };

    const updatedTodos = [...todos, newTodo];
    // setTodos(updatedTodos);
    const adjustedTodos = adjustEventTimeForClashes(updatedTodos);
    setTodos(adjustedTodos);
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    } catch (error) {
      console.log("Error saving todos:", error);
    }

    scheduleNotification(newTodo.course, newTodo.time);

    setSelectedCourse("");
  };
  const adjustEventTimeForClashes = (eventList) => {
    const sortedEvents = eventList.slice().sort((a, b) => a.time - b.time);
    const adjustedEvents = [];

    for (let i = 0; i < sortedEvents.length; i++) {
      const currentEvent = sortedEvents[i];
      const previousEvent = adjustedEvents[i - 1];

      if (previousEvent && currentEvent.time <= previousEvent.time) {
        // Adjust the current event's time to be after the previous event
        currentEvent.time = new Date(previousEvent.time);
        currentEvent.time.setMinutes(currentEvent.time.getMinutes() + 120);
      }

      adjustedEvents.push(currentEvent);
    }

    return adjustedEvents;
  };

  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    } catch (error) {
      console.log("Error saving todos:", error);
    }
  };

  const scheduleNotification = async (course, time) => {
    const triggerDate = new Date(time);
    const now = new Date();
    const nextWeek =
      now > triggerDate ? moment(now).add(1, "weeks") : moment(now);

    // Adjust the triggerDate with the selected day of the week and time
    nextWeek
      .day(triggerDate.getDay())
      .hour(triggerDate.getHours())
      .minute(triggerDate.getMinutes())
      .second(0)
      .millisecond(0);

    // Calculate trigger 5 minutes before the adjusted time
    const trigger = new Date(nextWeek);
    trigger.setMinutes(trigger.getMinutes() - 5);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Upcoming Event: ${course}`,
        body: `Upcoming event at ${moment(time).format("MMM D, YYYY HH:mm")}`,
      },
      trigger,
      repeats: true, // Repeat weekly
    });
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        alignItems: "center", // Align items vertically
      }}
    >
      <Text
        style={{
          color: "green",
          fontWeight: "bold",
        }}
      >
        {item.course}
      </Text>
      <Text>{moment(item.time).format("MMM D, YYYY HH:mm")}</Text>
      {/* <Button
        color='#FF0000'
        title='Delete'
        onPress={() => deleteTodo(item.id)}
      /> */}
      <TouchableOpacity
        onPress={() => deleteTodo(item.id)}
        style={{
          backgroundColor: "#FF0000",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderColor: "green",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );

  const navigateToRecommendation = () => {
    // Navigate to RecommendationScreen and pass completed events data
    navigation.navigate("Recommendation");
  };
  const navigateToCheckedEvents = () => {
    navigation.navigate("CheckedEvents");
    console.log("prop todo", todos);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Course: </Text>
      <TextInput
        value={selectedCourse}
        onChangeText={(text) => setSelectedCourse(text)}
        style={styles.input}
      />

      <Text>
        {moment(selectedDate).format("MMM D, YYYY")} -{" "}
        {moment(selectedTime).format("HH:mm")}{" "}
        {selectedTime.getHours() >= 12 ? "PM" : "AM"}
      </Text>
      <View style={{ flexDirection: "row", paddingVertical: 5 }}>
        <TouchableOpacity
          style={[styles.button, { width: 200, flex: 1 }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Select Date
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode='date'
            is24Hour={true}
            display='default'
            onChange={(event, selected) => {
              if (event.type === "set") {
                setSelectedDate(selected);
              }
              setShowDatePicker(false);
              setShowTimePicker(true);
            }}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode='time'
            is24Hour={true}
            display='default'
            onChange={(event, selected) => {
              if (event.type === "set") {
                setSelectedTime(selected);
              }
              setShowTimePicker(false);
            }}
          />
        )}
        {/* <Button color='green' title='Add Todo' onPress={addTodo} /> */}
        <TouchableOpacity
          style={[styles.button, { width: 200, flex: 1 }]}
          onPress={addTodo}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Add Todo
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View
        style={{
          flexDirection: "row",
          padding: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          style={[styles.button, { width: 200, flex: 1.5 }]}
          onPress={navigateToRecommendation}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Get Recommendations
          </Text>
        </Pressable>
        <Pressable
          style={[styles.button, { width: 200, flex: 1 }]}
          onPress={navigateToCheckedEvents}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            checkedEvents
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='WOA STUDENT HELPER' component={TodoScreen} />
        <Stack.Screen name='Recommendation' component={RecommendationScreen} />
        <Stack.Screen name='CheckedEvents' component={EventCheckScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    fontSize: 16,

    borderColor: "#353740;",
    borderWidth: 1,
    borderRadius: 4,

    padding: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "gray",
  },
  selectorContainer: {
    flexDirection: "row",
  },
  selector: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "gainsboro",
    margin: 5,
    padding: 8,
    borderRadius: 5,
    overflow: "hidden",
  },
  button: {
    marginTop: "auto",
    backgroundColor: "#10a37f",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,

    margin: 7,
  },
  button: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
    width: 100,
    textAlign: "center",
  },
  text: {
    color: "green",
    marginLeft: 10,
    fontFamily: "Roboto",
    padding: 5,
    fontWeight: "bold",
  },
});

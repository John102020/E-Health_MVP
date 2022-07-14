// Array of all the questions and choices to populate the questions. This might be saved in some JSON file or a database and we would have to read the data in.
var all_questions = [{
  question_string: "Have you been experiencing any headaches recently?",
  choices: [
    'Yes',
    'No',
  ]
}, {
  question_string: "Have you had any high/low temperatures recently?",
  choices: [
    'High temperatures',
    'Low temperatures',
    'Average temperatures',
  ]
}, {
  question_string: "Have you had trouble sleeping recently?",
  choices: [
    "Yes",
    "No",
  ]
}, {
  question_string: 'Have you been vomiting/experiencing pain in your stomach recently?',
  choices: [
    "Yes",
    'No',
  ]
}];

// An object for a Quiz, which will contain Question objects.
var Quiz = function(quiz_name) {
  // Private fields for an instance of a Quiz object.
  this.quiz_name = quiz_name;
  
  // This one will contain an array of Question objects in the order that the questions will be presented.
  this.questions = [];
}

// A function that you can enact on an instance of a quiz object. This function is called add_question() and takes in a Question object which it will add to the questions field.
Quiz.prototype.add_question = function(question) {
  this.questions.push(question);
}

// A function that you can enact on an instance of a quiz object. This function is called render() and takes in a variable called the container, which is the <div> that I will render the quiz in.
Quiz.prototype.render = function(container) {
  // For when we're out of scope
  var self = this;
  
  // Hide the quiz results modal
  $('#quiz-results').hide();
  
  // Write the name of the quiz
  $('#quiz-name').text(this.quiz_name);
  
  // Create a container for questions
  var question_container = $('<div>').attr('id', 'question').insertAfter('#quiz-name');
  
  // Helper function for changing the question and updating the buttons
  function change_question() {
    self.questions[current_question_index].render(question_container);
    $('#prev-question-button').prop('disabled', current_question_index === 0);
    $('#next-question-button').prop('disabled', current_question_index === self.questions.length - 1);
   
    
    // Determine if all questions have been answered
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  }
  
  // Render the first question
  var current_question_index = 0;
  change_question();
  
  // Add listener for the previous question button
  $('#prev-question-button').click(function() {
    if (current_question_index > 0) {
      current_question_index--;
      change_question();
    }
  });
  
  // Add listener for the next question button
  $('#next-question-button').click(function() {
    if (current_question_index < self.questions.length - 1) {
      current_question_index++;
      change_question();
    }
  });
 
  // Add listener for the submit answers button
  $('#submit-button').click(function() {
    // Determine how many questions the user got right
    var r = [];
    for (var i = 0; i < self.questions.length; i++) {
      r.push(self.questions[i].user_choice_index)
    }
    
    // Display the score with the appropriate message
    var diagnosis = {
  ['Fever'] : "Based on your answers, you may have a fever. Symptoms of fever can include sweating, chills and shivering, headaches, muscle aches, loss of appetite, irritability, dehydration, and general weakness. You should drink and rest a lot to recoever from fever, and although a doctor isn't needed, it is severe or you think it's needed don't hesitate. If you feel it's necessary, take acetaminophen (Tylenol, others), ibuprofen (Advil, Motrin IB, others) or aspirin.",
  ['Cold'] : "Based on your answers, you may have a cold. Symptoms of cold can include runny or stuffy nose, sore throat, cough, congestion, slight body aches or a mild headache, sneezing, low-grade fever, and generally feeling unwell. You should drink lots of water, rest, soothe the sore throat, sip warm liquids such as cofee or hot chocolate, or try some honey. Make sure you don't have COVID-19, as cold and COVID are very similar in symptoms. Going to the doctor isn't necessary, however if you feel like it might be serious contact them.",
  ['COVID-19'] : "Based on your answers, you may have COVID-19. Symptoms of COVID-19 can include fever or chills, cough, shortness of breath or difficulty breathing, fatigue, muscle, body aches, headache, new loss of taste or smell, sore throat, congestion or runny nose, nausea or vomiting, and diarrhea. If you think you have COVID-19, consult a doctor immediately to get more acquainted with the treatment, however general activities to improve your conditions are taking medications like acetaminophen or ibuprofen to reduce fever, drinking water or receiving intravenous fluids to stay hydrated, and getting plenty of rest to help the body fight the virus.",
  ['Nothing'] : "We were unable to conclude anything based on your answers. You don't seem to have anything really serious, but if you think you need to go to the doctor to get a check up don't hesitate. Always remember to drink lots of water and rest as those are some simple and common ways to treat yourself from several diseases.",
  ['Diarrhea'] : "Based on your answers, you may have Diarrhea. Symptoms of Diarrhea can include Abdominal cramps or pain, bloating, nausea, vomiting, fever, blood in the stool, mucus in the stool, and urgent need to have a bowel movement. Treatment may include replacing lost fluids with an oral rehydration solution (ORS) to prevent dehydration. Over-the-counter antidiarrheal drugs such as Pepto-Bismol and Kaopectate may also help. If possible make an appointment with your doctor to get a specific diagnosis and prescription.",
  ['Stomach Aches'] : "Based on your answers, you may have Stomach Aches. Symptoms of Stomach Aches can include trapped wind, indigestion, constipation, diarrhoea, and food poisoning. There are several treatments and not-to-do's to Stomach Aches. Some common ones include drinking water, not lying down, not eating difficult-to-digest foods, drinking lime, lemon juice, or baking soda with water, antacid or anti-gas medication, etc. Stomach Aches usually shouldn't require an appointment unless the symptoms appear to be really severe.",
  ['Headache'] : "Based on your answers, you may have a Headache. Symptoms of Headaches can include head hurting on both sides and dull pain around all parts of the head. Headaches are common and when alone don't need a doctor's appointment, however you should be aware of other symptoms you might be experiencing, as headaches are common symptoms of multiple other diseases that might require medical attenttion. Treatments include drinking water, resting, taking aspirin, acetaminophen, or ibuprofen, avoid foods high in histamine, hot or cold compresses to your head or neck, and small amounts of caffeine.",
}

    var Diagnosis_Mapping = [
      [ //headaches
        [ //high temperatures
          ['Diarrhea','Fever'], //trouble sleeping, vomit
          ['COVID-19','Diarrhea'], //sleeping, vomit
        ],
        [ //low temperatures
          ['Diarrhea','Cold'],  //trouble sleeping, vomit
          ['COVID-19','Cold'], // sleeping, vomit
        ],
        [ //regular temperatures
          ['Diarrhea','COVID-19'], //trouble sleeping, vomit
          ['COVID-19','Headaches'],// sleeping, vomit
        ],
      ],
      [ //no headaches
        [//high temperatures
          ['Diarrhea','Fever'], //trouble sleeping, vomit
          ['COVID-19','Stomach Aches'],// sleeping, vomit
        ],
        [// low temperatures
          ['COVID-19','Cold'], //trouble sleeping, vomit
          ['COVID-19','Cold'],// sleeping, vomit
        ],
        [ // normal temperatures
          ['Stomach Aches','Nothing'], //trouble sleeping, vomit
          ['Stomach Aches','Nothing'], // sleeping, vomit
        ],
      ],
    ]
    var d = Diagnosis_Mapping[r[0]][r[1]][r[2]][r[3]]
    $('#quiz-results-message').text('You have been diagnosed with ' + d);
    $('#quiz-results-score').html(diagnosis[d]);
    $('#quiz-results').slideDown();
    $('#submit-button').slideUp();
    $('#next-question-button').slideUp();
    $('#prev-question-button').slideUp();
    //$('#quiz-retry-button').sideDown();
    
  });
  
  // Add a listener on the questions container to listen for user select changes. This is for determining whether we can submit answers or not.
  question_container.bind('user-select-change', function() {
    var all_questions_answered = true;
    for (var i = 0; i < self.questions.length; i++) {
      if (self.questions[i].user_choice_index === null) {
        all_questions_answered = false;
        break;
      }
    }
    $('#submit-button').prop('disabled', !all_questions_answered);
  });
}

// An object for a Question, which contains the question, the correct choice, and wrong choices. This block is the constructor.
var Question = function(question_string, choices) {
  // Private fields for an instance of a Question object.
  this.question_string = question_string;
  this.choices = choices;
  this.user_choice_index = null; // Index of the user's choice selection
}

// A function that you can enact on an instance of a question object. This function is called render() and takes in a variable called the container, which is the <div> that I will render the question in. This question will "return" with the score when the question has been answered.
Question.prototype.render = function(container) {
  // For when we're out of scope
  var self = this;
  
  // Fill out the question label
  var question_string_h2;
  if (container.children('h2').length === 0) {
    question_string_h2 = $('<h2>').appendTo(container);
  } else {
    question_string_h2 = container.children('h2').first();
  }
  question_string_h2.text(this.question_string);
  
  // Clear any radio buttons and create new ones
  if (container.children('input[type=radio]').length > 0) {
    container.children('input[type=radio]').each(function() {
      var radio_button_id = $(this).attr('id');
      $(this).remove();
      container.children('label[for=' + radio_button_id + ']').remove();
    });
  }
  for (var i = 0; i < this.choices.length; i++) {
    // Create the radio button
    var choice_radio_button = $('<input>')
      .attr('id', 'choices-' + i)
      .attr('type', 'radio')
      .attr('name', 'choices')
      .attr('value', 'choices-' + i)
      .attr('checked', i === this.user_choice_index)
      .appendTo(container);
    
    // Create the label
    var choice_label = $('<label>')
      .text(this.choices[i])
      .attr('for', 'choices-' + i)
      .appendTo(container);
  }
  
  // Add a listener for the radio button to change which one the user has clicked on
  $('input[name=choices]').change(function(index) {
    var selected_radio_button_value = $('input[name=choices]:checked').val();
    
    // Change the user choice index
    self.user_choice_index = parseInt(selected_radio_button_value.substr(selected_radio_button_value.length - 1, 1));
    
    // Trigger a user-select-change
    container.trigger('user-select-change');
  });
}

// "Main method" which will create all the objects and render the Quiz.
$(document).ready(function() {
  // Create an instance of the Quiz object
  var quiz = new Quiz('Check Up');
  
  // Create Question objects from all_questions and add them to the Quiz object
  for (var i = 0; i < all_questions.length; i++) {
    // Create a new Question object
    var question = new Question(all_questions[i].question_string, all_questions[i].choices);
    
    // Add the question to the instance of the Quiz object that we created previously
    quiz.add_question(question);
  }
  
  // Render the quiz
  var quiz_container = $('#quiz');
  quiz.render(quiz_container);
});
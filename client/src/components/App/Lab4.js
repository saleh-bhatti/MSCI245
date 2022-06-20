import * as React from 'react';

const App = () => {

  const recipes = [
    {
      title: 'Fruit salad',
      difficulty: '2',
      ingredients: ['apple', 'banana', 'blueberries', 'raisins', 'walnuts'],
      calories: "200",
      instructions: "Wash fresh fruit. Slice fruit into pieces. Mix all ingredients in a bowl."
    }, {
      title: 'Avocado wrap',
      difficulty: '3',
      ingredients: ['avocado', 'spinach', 'pine nuts', 'mayo', 'apple', 'tortilla bread'],
      calories: "400",
      instructions: "Wash all fruits and vegetables. Slice avocadoes and apples. Mix all ingredients and wrap them in a tortilla bread."
    },
  ];

  return (
    <div>
      <h1>
        Recipe finder
      </h1>



    </div>
  );
}




export default App;

import Storage from './Storage';


class CalorieTracker{
    // Private Properties
    #calorieLimit = Storage.getCalorieLimit(); //calling static method of our storage class, default is 2000, and if we pass something then that will be set as calorie limit, also can change from frontend GUI
    #totalCalories = Storage.getTotalCalories();
    #meals = Storage.getMeals();;
    #workouts =Storage.getWorkouts();
    // #calorieLimit = 2000
    // #totalCalories = 0;
    // #meals = [];
    // #workouts =[];
    constructor(){
        // Commented properties are private properties using old convention which is not actually private, So We made it private like above the constructor
        // this._calorieLimit = 2000;
        // this._totalCalories = 0;
        // this._meals = [];
        // this._workouts =[];

        // Constructor runs immediately after instantiating the class so our functions calls and event listeners will be here
        this.#displayCaloriesLimit();
        this.#displayCaloriesTotal();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
        this.#displayCaloriesRemaining();
        this.#displayCaloriesProgress();
        document.getElementById('limit').value = this.#calorieLimit;
    }
    
    // Public Methods
    addMeal(meal){
        this.#meals.push(meal);
        this.#totalCalories += meal.calories;
        Storage.updateTotalCalories(this.#totalCalories);
        Storage.saveMeal(meal);
        this.#displayNewMeal(meal);
        this.#render();
    }
    addWorkout(workout){
        this.#workouts.push(workout);
        this.#totalCalories -= workout.calories;
        Storage.updateTotalCalories(this.#totalCalories);
        Storage.saveWorkout(workout);
        this.#displayNewWorkout(workout);
        this.#render();
    }
    removeMeal(id){
        const index = this.#meals.findIndex(meal=> meal.id === id);
        if(index !== -1){
            const meal = this.#meals[index];
            this.#totalCalories -= meal.calories;
            Storage.updateTotalCalories(this.#totalCalories);
            this.#meals.splice(index, 1);
            Storage.removeMeal(id);
            this.#render();
        }
    }
    removeWorkout(id){
        //different ways for remove workout and remove meal for practice
        let workout = this.#workouts.filter(workout=> workout.id === id);
        this.#totalCalories += workout[0].calories;
        Storage.updateTotalCalories(this.#totalCalories);
        this.#workouts = this.#workouts.filter(item=> item.id !== id);
        Storage.removeWorkout(id);
        this.#render();
    }
    reset(){
        this.#totalCalories = 0;
        this.#meals = [];
        this.#workouts = [];
        this.#render();
        Storage.clearAll();
        this.#calorieLimit
    }
    setLimit(calorieLimit){
        this.#calorieLimit = calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this.#displayCaloriesLimit();
        this.#render();
    }

    loadItems(){
        this.#meals.forEach(meal => this.#displayNewMeal(meal));
        this.#workouts.forEach(workout => this.#displayNewWorkout(workout));
    }
    
    // Private Methods
    #displayCaloriesTotal(){
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this.#totalCalories;
    }
    #displayCaloriesLimit(){
        const CalorieLimitEl = document.getElementById('calories-limit');
        CalorieLimitEl.innerHTML = this.#calorieLimit;
    }
    #displayCaloriesConsumed(){
        const CaloriesConsumedEl = document.getElementById('calories-consumed');
        const consumed = this.#meals.reduce((total, meal)=>total+meal.calories, 0);
        CaloriesConsumedEl.innerHTML = consumed;
    }
    #displayCaloriesBurned(){
        const CaloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this.#workouts.reduce((total, workout)=>total+workout.calories, 0);
        CaloriesBurnedEl.innerHTML = burned;
    }
    #displayCaloriesRemaining(){
        const CaloriesRemainingEl = document.getElementById('calories-remaining');
        const progressEl = document.getElementById('calorie-progress');
        const remaining = this.#calorieLimit - this.#totalCalories; 
        CaloriesRemainingEl.innerHTML = remaining;
        
        if(remaining <= 0){
            CaloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            CaloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        }else{
            CaloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            CaloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }
    #displayCaloriesProgress(){
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }

    #displayNewMeal(meal){
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;
      mealsEl.appendChild(mealEl);
    }

    #displayNewWorkout(workout){
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `<div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>`;
      workoutsEl.appendChild(workoutEl);
    }

    #render(){
        this.#displayCaloriesTotal();
        this.#displayCaloriesConsumed();
        this.#displayCaloriesBurned();
        this.#displayCaloriesRemaining();
        this.#displayCaloriesProgress();
    }
}

export default CalorieTracker;
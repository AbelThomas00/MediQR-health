import React, { useMemo } from 'react';
import { useMediQR } from '../context/MediQRContext';

const DietPlanPage = () => {
  const { patientData, isLoading } = useMediQR();

  const { restrictions, meals, macros } = useMemo(() => {
    if (!patientData) return { restrictions: [], meals: [], macros: {} };
    
    let restrs = [];
    let isDiabetic = false;
    let isHypertensive = false;
    
    // Safely parse conditions
    const conditions = Array.isArray(patientData.conditions) ? patientData.conditions : (patientData.conditions ? [patientData.conditions] : []);
    
    if (conditions.includes("Hypertension")) {
      restrs.push("Low Sodium (< 1500mg/day)");
      isHypertensive = true;
    }
    if (conditions.includes("Type 2 Diabetes")) {
      restrs.push("Low Carbohydrate / Low Sugar");
      isDiabetic = true;
    }
    
    // Safely parse allergies
    const allergies = Array.isArray(patientData.allergies) ? patientData.allergies : (patientData.allergies ? [patientData.allergies] : []);
    
    if (allergies.length > 0) {
      allergies.forEach(a => restrs.push(`Strictly No ${a}`));
    }

    // Default Macros
    let macroCalc = { calories: 1800, protein: '90g', carbs: '150g', fat: '60g' };
    
    if (isDiabetic) {
      macroCalc.carbs = '100g';
      macroCalc.protein = '110g';
      macroCalc.fat = '75g';
    }

    // Sample Daily Plan
    const mealPlan = [
      {
        id: 1,
        time: "08:00 AM",
        type: "Breakfast",
        name: isDiabetic ? "Scrambled Eggs with Spinach & Avocado" : "Oatmeal with Berries & Almonds",
        calories: 320,
        notes: allergies.includes("Peanuts") ? "Cooked in olive oil (peanut-free facility)." : "Heart healthy.",
        icon: "free_breakfast"
      },
      {
        id: 2,
        time: "01:00 PM",
        type: "Lunch",
        name: isHypertensive ? "Grilled Lemon Herb Chicken Salad (No Salt Dressing)" : "Quinoa & Black Bean Bowl",
        calories: 450,
        notes: isHypertensive ? "Uses lemon and herbs instead of salt for flavor." : "High fiber.",
        icon: "restaurant"
      },
      {
        id: 3,
        time: "04:00 PM",
        type: "Snack",
        name: isDiabetic ? "Greek Yogurt with Chia Seeds" : "Apple Slices with Almond Butter",
        calories: 150,
        notes: "Keeps blood sugar stable.",
        icon: "local_cafe"
      },
      {
        id: 4,
        time: "07:00 PM",
        type: "Dinner",
        name: "Baked Salmon with Roasted Asparagus",
        calories: 500,
        notes: isHypertensive ? "Rich in Omega-3, naturally low sodium." : "Lean protein.",
        icon: "set_meal"
      }
    ];

    return { restrictions: restrs, meals: mealPlan, macros: macroCalc };
  }, [patientData]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="glass-panel p-8 rounded-xl text-center">
        <h2 className="text-headline-md font-bold text-on-surface mb-2">No Patient Data</h2>
        <p className="text-on-surface-variant">Unable to load patient profile.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
        </div>
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight">Personalized Diet Plan</h1>
          <p className="text-body-md text-on-surface-variant">Tailored nutrition for {patientData.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient Profile & Restrictions */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          <div className="glass-panel p-6 rounded-xl hover-lift">
            <h2 className="text-body-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">health_and_safety</span>
              Clinical Dietary Profile
            </h2>
            
            <div className="flex flex-col gap-3">
              {restrictions.length > 0 ? restrictions.map((res, idx) => (
                <div key={idx} className={`p-3 rounded-lg border flex items-start gap-3 ${res.includes('No') ? 'bg-error-container/20 border-error/30 text-on-surface' : 'bg-warning-container/20 border-warning/30 text-on-surface'}`}>
                   <span className={`material-symbols-outlined mt-0.5 text-sm ${res.includes('No') ? 'text-error' : 'text-warning'}`}>warning</span>
                   <span className="font-bold text-sm">{res}</span>
                </div>
              )) : (
                <p className="text-on-surface-variant text-sm">No specific dietary restrictions listed.</p>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
               <h3 className="text-xs font-label-caps text-outline mb-3">Daily Macro Targets</h3>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container-highest dark:bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-center">
                     <div className="text-xs text-on-surface-variant font-bold">Calories</div>
                     <div className="text-lg font-bold text-primary">{macros.calories}</div>
                  </div>
                  <div className="bg-surface-container-highest dark:bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-center">
                     <div className="text-xs text-on-surface-variant font-bold">Protein</div>
                     <div className="text-lg font-bold text-primary">{macros.protein}</div>
                  </div>
                  <div className="bg-surface-container-highest dark:bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-center">
                     <div className="text-xs text-on-surface-variant font-bold">Carbs</div>
                     <div className="text-lg font-bold text-primary">{macros.carbs}</div>
                  </div>
                  <div className="bg-surface-container-highest dark:bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-center">
                     <div className="text-xs text-on-surface-variant font-bold">Fats</div>
                     <div className="text-lg font-bold text-primary">{macros.fat}</div>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-xl text-center border-dashed border-2 hover-lift">
             <span className="material-symbols-outlined text-primary/50 text-4xl mb-2">water_drop</span>
             <h3 className="font-bold text-on-surface">Hydration Goal</h3>
             <p className="text-sm text-on-surface-variant mt-1">Drink at least 2.5 Liters of water daily.</p>
          </div>

        </div>

        {/* Right Column: Meal Plan */}
        <div className="lg:col-span-2 flex flex-col gap-4">
           <div className="flex items-center justify-between mb-2">
              <h2 className="text-headline-md font-bold text-on-surface">Today's Menu</h2>
              <button className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">print</span> Print Menu
              </button>
           </div>
           
           <div className="glass-panel rounded-xl overflow-hidden">
              <div className="divide-y divide-outline-variant/20">
                 {meals.map(meal => (
                    <div key={meal.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                       <div className="flex flex-col md:w-32 shrink-0">
                          <span className="text-primary font-bold text-sm">{meal.time}</span>
                          <span className="text-xs font-label-caps text-outline uppercase tracking-wider">{meal.type}</span>
                       </div>
                       
                       <div className="w-12 h-12 bg-surface-container-highest dark:bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0 border border-outline-variant/30">
                          <span className="material-symbols-outlined text-on-surface-variant">{meal.icon}</span>
                       </div>
                       
                       <div className="flex-1 flex flex-col gap-1">
                          <h3 className="font-bold text-on-surface text-lg leading-tight">{meal.name}</h3>
                          <p className="text-sm text-on-surface-variant bg-tertiary-container/10 border-l-2 border-tertiary pl-2 py-0.5 mt-1">{meal.notes}</p>
                       </div>
                       
                       <div className="md:text-right shrink-0">
                          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                             <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                             {meal.calories} kcal
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="glass-panel p-4 rounded-xl flex items-start gap-3 mt-4 bg-primary/5 border-primary/20">
              <span className="material-symbols-outlined text-primary mt-0.5">info</span>
              <p className="text-sm text-on-surface-variant">
                 <strong>AI Nutrition Notice:</strong> This meal plan is programmatically generated based on your clinical conditions ({patientData.conditions?.join(', ')}) and allergies. Please consult your primary care physician before making drastic changes to your diet.
              </p>
           </div>

        </div>

      </div>
    </div>
  );
};

export default DietPlanPage;

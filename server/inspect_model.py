import pickle
try:
    with open('student_dropout_model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Type:", type(model))
    if hasattr(model, 'feature_names_in_'):
        print("Features:", list(model.feature_names_in_))
    else:
        print("No feature_names_in_ attribute.")
except Exception as e:
    print("Error:", e)

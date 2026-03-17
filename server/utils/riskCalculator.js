exports.calculateRisk = (attendance, cgpa, engagement) => {

  if (attendance < 70 && cgpa < 6 && engagement < 50) {
    return "High";
  }

  if (attendance < 75 || cgpa < 7) {
    return "Medium";
  }

  return "Low";
};
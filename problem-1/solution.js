// Method 1: Using for loop
const sum_to_n_a = (n) => {
  let sum = 0;
  // Revert loop for the best performance
  for (let i = n; i > 0; i--) {
    sum += i;
  }
  return sum;
};

// Method 2: Using math formula
// Reference: https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF
const sum_to_n_b = (n) => {
  return (n * (n + 1)) / 2;
};

// Method 3: Using recursion
const sum_to_n_c = (n) => {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
};

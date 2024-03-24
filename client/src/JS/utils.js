

export function sortUsersByBalance(users) {
    // Use the sort() function to sort users based on their balance
    users.sort((a, b) => {
      // Compare the balance of two users
      if (a.balance < b.balance) {
        return 1; // If balance of 'a' is less than 'b', 'b' comes first
      } else if (a.balance > b.balance) {
        return -1; // If balance of 'a' is greater than 'b', 'a' comes first
      } else {
        return 0; // If balance of 'a' is equal to 'b', maintain the order
      }
    });
  
    return users;
  }
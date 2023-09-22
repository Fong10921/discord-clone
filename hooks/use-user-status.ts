import { create } from 'zustand';

interface ConnectedUsersState {
  connectedUsers: string[];
  modifyUsers: (userId: string, type: 'add' | 'remove') => void;
}

const useConnectedUsersStore = create<ConnectedUsersState>((set) => ({
  connectedUsers: [],
  modifyUsers: (userId: string, type: 'add' | 'remove') => set((state) => {
    let newUsers = [...state.connectedUsers];
    if (type === 'add' && !newUsers.includes(userId)) {
      newUsers.push(userId);
    } else if (type === 'remove') {
      newUsers = newUsers.filter(id => id !== userId);
    }
    return { connectedUsers: newUsers };
  }),
}));

export default useConnectedUsersStore;

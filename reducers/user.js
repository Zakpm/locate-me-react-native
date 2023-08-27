import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { nickname: '', places: [] },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addNickname: (state, action) => {
      state.value.nickname = action.payload;
    },
    addPlace: (state, action) => {
      state.value.places.push(action.payload);
    },
    removePlace: (state, action) => {
      // On utilise la méthode filter pour supprimer un lieu de la liste des lieux
      console.log('ActionPayload', action.payload);
      state.value.places = state.value.places.filter(
        // On filtre la liste des lieux pour ne garder que ceux dont le nom est différent de celui passé en paramètre
        (place) => place.name != action.payload
      );
    },
  },
});

export const { addNickname, addPlace, removePlace } = userSlice.actions;
export default userSlice.reducer;

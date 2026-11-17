"use client";

import { SavedCafesClientProps } from './types';
import { useSavedPageState } from './useSavedPageState';
import { SavedGuest } from './SavedGuest';
import { SavedCollectionView } from './SavedCollectionView';

export default function SavedCafesClient(props: SavedCafesClientProps) {
const state = useSavedPageState(props);
if (!state.previewMode && !state.isLoggedIn) return <SavedGuest />;
return <SavedCollectionView state={state} />;
}

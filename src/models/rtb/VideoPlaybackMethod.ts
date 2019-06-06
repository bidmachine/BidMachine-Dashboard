import {enumValues} from '../../lib/enum';

export enum VideoPlaybackMethod {
    auto_play_sound_on = 1,
    auto_play_sound_off,
    click_to_play,
    mouse_over
}

export const videoPlaybackMethodLabels = {
    [VideoPlaybackMethod.auto_play_sound_on]: 'Auto-Play Sound On',
    [VideoPlaybackMethod.auto_play_sound_off]: 'Auto-Play Sound Off',
    [VideoPlaybackMethod.click_to_play]: 'Click-to-Play',
    [VideoPlaybackMethod.mouse_over]: 'Mouse-Over'
};

export const videoPlaybackMethods = enumValues(VideoPlaybackMethod, videoPlaybackMethodLabels);

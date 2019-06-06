import {enumValues} from '../../lib/enum';

export enum CreativeAttribute {
    audio_ad_auto_play = 1,
    audio_ad_user_initiated,
    expandable_automatic,
    expandable_user_click,
    expandable_user_rollover,
    in_banner_video_ad_auto_play,
    in_banner_video_ad_user_init,
    pop,
    provocative,
    epilepsy_warning,
    surveys,
    text_only,
    user_interactive,
    alert_style,
    has_audion_button,
    ad_can_be_skipped,
}

export const creativeAttributeLabels = {
    [CreativeAttribute.audio_ad_auto_play]: 'Audio Ad (Auto-Play)',
    [CreativeAttribute.audio_ad_user_initiated]: 'Audio Ad (User Initiated)',
    [CreativeAttribute.expandable_automatic]: 'Expandable (Automatic)',
    [CreativeAttribute.expandable_user_click]: 'Expandable (User Initiated - Click)',
    [CreativeAttribute.expandable_user_rollover]: 'Expandable (User Initiated - Rollover)',
    [CreativeAttribute.in_banner_video_ad_auto_play]: 'In-Banner Video Ad (Auto-Play)',
    [CreativeAttribute.in_banner_video_ad_user_init]: 'In-Banner Video Ad (User Initiated)',
    [CreativeAttribute.pop]: 'Pop (e.g., Over, Under, or Upon Exit)',
    [CreativeAttribute.provocative]: 'Provocative or Suggestive Imagery',
    [CreativeAttribute.epilepsy_warning]: 'Shaky, Flashing, Flickering, Extreme Animation, Smileys',
    [CreativeAttribute.surveys]: 'Surveys',
    [CreativeAttribute.text_only]: 'Text Only',
    [CreativeAttribute.user_interactive]: 'User Interactive (e.g., Embedded Games)',
    [CreativeAttribute.alert_style]: 'Windows Dialog or Alert Style',
    [CreativeAttribute.has_audion_button]: 'Has Audio On/Off Button',
    [CreativeAttribute.ad_can_be_skipped]: 'Ad Can be Skipped (e.g., Skip Button on Pre-Roll Video)'
};

export const creativeAttributes = enumValues(CreativeAttribute, creativeAttributeLabels);

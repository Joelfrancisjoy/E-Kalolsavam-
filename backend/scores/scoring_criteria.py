"""
Event-specific scoring criteria configuration.
Each event has 4 criteria, each worth 25 points (total 100).
"""
import re

# Theatre Category
THEATRE_CRITERIA = {
    'Mime': [
        {'id': 'technical_skill', 'label': 'Technical Skill', 'max': 25},
        {'id': 'artistic_expression', 'label': 'Artistic Expression', 'max': 25},
        {'id': 'stage_presence', 'label': 'Stage Presence', 'max': 25},
        {'id': 'overall_impression', 'label': 'Overall Impression', 'max': 25},
    ],
    'Skit': [
        {'id': 'acting_skill', 'label': 'Acting Skill', 'max': 25},
        {'id': 'script_dialogue', 'label': 'Script & Dialogue Delivery', 'max': 25},
        {'id': 'team_coordination', 'label': 'Team Coordination', 'max': 25},
        {'id': 'audience_impact', 'label': 'Audience Impact', 'max': 25},
    ],
}

# Dance Category
DANCE_CRITERIA = {
    'Classical Dance': [
        {'id': 'technique_posture', 'label': 'Technique & Posture', 'max': 25},
        {'id': 'rhythm_synchronization', 'label': 'Rhythm & Synchronization', 'max': 25},
        {'id': 'expression', 'label': 'Expression', 'max': 25},
        {'id': 'costume_presentation', 'label': 'Costume & Presentation', 'max': 25},
    ],
    'Western Dance': [
        {'id': 'energy_creativity', 'label': 'Energy & Creativity', 'max': 25},
        {'id': 'synchronization', 'label': 'Synchronization', 'max': 25},
        {'id': 'choreography', 'label': 'Choreography', 'max': 25},
        {'id': 'stage_impact', 'label': 'Stage Impact', 'max': 25},
    ],
}

# Visual Arts Category
VISUAL_ARTS_CRITERIA = {
    'Painting - Oil Colour': [
        {'id': 'composition_layout', 'label': 'Composition & Layout', 'max': 25},
        {'id': 'colour_harmony', 'label': 'Colour Harmony & Blending', 'max': 25},
        {'id': 'creativity_originality', 'label': 'Creativity & Originality', 'max': 25},
        {'id': 'technique_detailing', 'label': 'Technique & Detailing', 'max': 25},
    ],
    'Pencil Sketching': [
        {'id': 'line_quality', 'label': 'Line Quality & Shading', 'max': 25},
        {'id': 'proportion_perspective', 'label': 'Proportion & Perspective', 'max': 25},
        {'id': 'creativity', 'label': 'Creativity', 'max': 25},
        {'id': 'presentation_neatness', 'label': 'Presentation & Neatness', 'max': 25},
    ],
    'Cartooning': [
        {'id': 'concept_clarity', 'label': 'Concept Clarity', 'max': 25},
        {'id': 'humor_expression', 'label': 'Humor & Expression', 'max': 25},
        {'id': 'line_precision', 'label': 'Line Precision', 'max': 25},
        {'id': 'creativity_style', 'label': 'Creativity & Style', 'max': 25},
    ],
}

# Music Category
MUSIC_CRITERIA = {
    'Light Music': [
        {'id': 'voice_quality', 'label': 'Voice Quality', 'max': 25},
        {'id': 'pitch_rhythm', 'label': 'Pitch & Rhythm Accuracy', 'max': 25},
        {'id': 'expression_feel', 'label': 'Expression & Feel', 'max': 25},
        {'id': 'song_presentation', 'label': 'Song Selection & Presentation', 'max': 25},
    ],
    'Violin': [
        {'id': 'technical_proficiency', 'label': 'Technical Proficiency', 'max': 25},
        {'id': 'bowing_fingering', 'label': 'Bowing & Fingering Accuracy', 'max': 25},
        {'id': 'rhythm_tempo', 'label': 'Rhythm & Tempo Control', 'max': 25},
        {'id': 'musical_interpretation', 'label': 'Musical Interpretation', 'max': 25},
    ],
    'Violin (Instrumental)': [
        {'id': 'technical_proficiency', 'label': 'Technical Proficiency', 'max': 25},
        {'id': 'bowing_fingering', 'label': 'Bowing & Fingering Accuracy', 'max': 25},
        {'id': 'rhythm_tempo', 'label': 'Rhythm & Tempo Control', 'max': 25},
        {'id': 'musical_interpretation', 'label': 'Musical Interpretation', 'max': 25},
    ],
    'Western Solo': [
        {'id': 'stage_presence', 'label': 'Stage Presence', 'max': 25},
        {'id': 'musical_expression', 'label': 'Musical Expression', 'max': 25},
        {'id': 'dynamics_tone', 'label': 'Dynamics & Tone', 'max': 25},
        {'id': 'technical_control', 'label': 'Technical Control', 'max': 25},
    ],
}

# Literary Category
LITERARY_CRITERIA = {
    'Essay Writing': [
        {'id': 'content_relevance', 'label': 'Content Relevance', 'max': 25},
        {'id': 'creativity_thought', 'label': 'Creativity & Original Thought', 'max': 25},
        {'id': 'structure_coherence', 'label': 'Structure & Coherence', 'max': 25},
        {'id': 'language_grammar', 'label': 'Language & Grammar', 'max': 25},
    ],
    'Essay Writing - English': [
        {'id': 'content_relevance', 'label': 'Content Relevance', 'max': 25},
        {'id': 'creativity_thought', 'label': 'Creativity & Original Thought', 'max': 25},
        {'id': 'structure_coherence', 'label': 'Structure & Coherence', 'max': 25},
        {'id': 'language_grammar', 'label': 'Language & Grammar', 'max': 25},
    ],
    'Essay Writing - Hindi': [
        {'id': 'content_relevance', 'label': 'Content Relevance', 'max': 25},
        {'id': 'creativity_thought', 'label': 'Creativity & Original Thought', 'max': 25},
        {'id': 'structure_coherence', 'label': 'Structure & Coherence', 'max': 25},
        {'id': 'language_grammar', 'label': 'Language & Grammar', 'max': 25},
    ],
    'Essay Writing - Malayalam': [
        {'id': 'content_relevance', 'label': 'Content Relevance', 'max': 25},
        {'id': 'creativity_thought', 'label': 'Creativity & Original Thought', 'max': 25},
        {'id': 'structure_coherence', 'label': 'Structure & Coherence', 'max': 25},
        {'id': 'language_grammar', 'label': 'Language & Grammar', 'max': 25},
    ],
    'Poetry Recitation': [
        {'id': 'voice_modulation', 'label': 'Voice Modulation', 'max': 25},
        {'id': 'clarity_speech', 'label': 'Clarity of Speech', 'max': 25},
        {'id': 'emotional_expression', 'label': 'Emotional Expression', 'max': 25},
        {'id': 'overall_presentation', 'label': 'Overall Presentation', 'max': 25},
    ],
    'Poetry Recitation - English': [
        {'id': 'voice_modulation', 'label': 'Voice Modulation', 'max': 25},
        {'id': 'clarity_speech', 'label': 'Clarity of Speech', 'max': 25},
        {'id': 'emotional_expression', 'label': 'Emotional Expression', 'max': 25},
        {'id': 'overall_presentation', 'label': 'Overall Presentation', 'max': 25},
    ],
    'Poetry Recitation - Hindi': [
        {'id': 'voice_modulation', 'label': 'Voice Modulation', 'max': 25},
        {'id': 'clarity_speech', 'label': 'Clarity of Speech', 'max': 25},
        {'id': 'emotional_expression', 'label': 'Emotional Expression', 'max': 25},
        {'id': 'overall_presentation', 'label': 'Overall Presentation', 'max': 25},
    ],
    'Poetry Recitation - Malayalam': [
        {'id': 'voice_modulation', 'label': 'Voice Modulation', 'max': 25},
        {'id': 'clarity_speech', 'label': 'Clarity of Speech', 'max': 25},
        {'id': 'emotional_expression', 'label': 'Emotional Expression', 'max': 25},
        {'id': 'overall_presentation', 'label': 'Overall Presentation', 'max': 25},
    ],
    'Debate': [
        {'id': 'clarity_argument', 'label': 'Clarity of Argument', 'max': 25},
        {'id': 'relevance_points', 'label': 'Relevance of Points', 'max': 25},
        {'id': 'presentation_confidence', 'label': 'Presentation & Confidence', 'max': 25},
        {'id': 'rebuttal_strength', 'label': 'Rebuttal Strength', 'max': 25},
    ],
}

# Default criteria for events not specifically configured
DEFAULT_CRITERIA = [
    {'id': 'technical_skill', 'label': 'Technical Skill', 'max': 25},
    {'id': 'artistic_expression', 'label': 'Artistic Expression', 'max': 25},
    {'id': 'stage_presence', 'label': 'Stage Presence', 'max': 25},
    {'id': 'overall_impression', 'label': 'Overall Impression', 'max': 25},
]

# Master configuration mapping
SCORING_CRITERIA = {
    'theatre': THEATRE_CRITERIA,
    'visual_arts': VISUAL_ARTS_CRITERIA,
    'music': MUSIC_CRITERIA,
    'literary': LITERARY_CRITERIA,
    'dance': DANCE_CRITERIA,
}


def _normalize_name(s: str) -> str:
    """Normalize event names for robust matching."""
    s = (s or '').lower().strip()
    # Normalize different dash characters to '-'
    s = re.sub(r'[\u2010-\u2015\u2212]', '-', s)
    # Normalize spaces around hyphens and ampersands
    s = re.sub(r'\s*-\s*', '-', s)
    s = re.sub(r'\s*&\s*', ' & ', s)
    # Collapse whitespace
    s = re.sub(r'\s+', ' ', s)
    return s


def _strip_parentheticals(s: str) -> str:
    """Remove parenthetical content for looser matching (e.g., 'Violin (Instrumental)')."""
    return re.sub(r'\s*\(.*?\)\s*', ' ', s or '').strip()


def get_criteria_for_event(event_name, category):
    """
    Get scoring criteria for a specific event with robust name matching.
    """
    category_criteria = SCORING_CRITERIA.get(category, {})
    if not category_criteria:
        return DEFAULT_CRITERIA

    # Build a normalized lookup map (includes versions without parentheses)
    normalized_map = {}
    for key, value in category_criteria.items():
        k_norm = _normalize_name(key)
        normalized_map[k_norm] = value
        k_no_paren = _normalize_name(_strip_parentheticals(key))
        normalized_map.setdefault(k_no_paren, value)

    ename_norm = _normalize_name(event_name)
    ename_no_paren = _normalize_name(_strip_parentheticals(event_name))

    # Exact normalized match
    if ename_norm in normalized_map:
        return normalized_map[ename_norm]
    if ename_no_paren in normalized_map:
        return normalized_map[ename_no_paren]

    # Partial contains match across normalized keys
    for k, v in normalized_map.items():
        if k in ename_norm or ename_norm in k or k in ename_no_paren or ename_no_paren in k:
            return v

    # Fallback
    return DEFAULT_CRITERIA


def get_all_criteria_ids(criteria):
    """
    Extract all criterion IDs from a criteria list.
    
    Args:
        criteria: List of criteria dictionaries
    
    Returns:
        List of criterion IDs
    """
    return [c['id'] for c in criteria]


def validate_score_data(score_data, criteria):
    """
    Validate that score data contains all required criteria.
    
    Args:
        score_data: Dictionary of scores
        criteria: List of criteria dictionaries
    
    Returns:
        Tuple of (is_valid, missing_fields)
    """
    required_ids = get_all_criteria_ids(criteria)
    missing = [cid for cid in required_ids if cid not in score_data or score_data[cid] is None]
    return len(missing) == 0, missing

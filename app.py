from flask import Flask, render_template, request, jsonify
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs
import json
import os

load_dotenv()

app = Flask(__name__)

# ======================================
# API CONFIG
# ======================================

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

OPENROUTER_URL = os.getenv("OPENROUTER_API_URL")

# GEMINI

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")


# ======================================
# PAGES
# ======================================

@app.route("/")
def home():
    return render_template("home.html")

# ======================================
# ABOUT US PAGE
# ======================================

@app.route("/about")
def about():
    return render_template("about.html")

# ======================================
# CONTACT US PAGE
# ======================================

@app.route("/contact")
def contact():
    return render_template("contact.html")

# ======================================
# AI TOOLS HUB PAGE
# ======================================

@app.route("/tools")
def tools():
    return render_template("tools.html")

# ======================================
# AI EMAIL WRITER PAGE
# ======================================

@app.route("/ai-email-writer")
def ai_email_writer():
    return render_template("ai-email-writer.html")

# ======================================
# YOUTUBE SUMMARY TRANSCRIPT PAGE
# ======================================

@app.route("/youtube-summary")
def youtube_summary():
    return render_template("youtube-summary.html")

# ======================================
# AI VOICE NOTES PAGE
# ======================================

@app.route("/voice-notes-ai")
def voice_notes_ai():
    return render_template("voice-notes-ai.html")

# ======================================
# LINKEDIN POST GENERATOR PAGE
# ======================================

@app.route("/linkedin-post-generator")
def linkedin_post_generator():
    return render_template(
        "linkedin-post-generator.html"
    )

# ======================================
# GRAMMAR FIXER PAGE
# ======================================

@app.route('/grammar-fixer')
def grammar_fixer():
    return render_template(
        'grammar-fixer.html'
    )

# ======================================
# INSTAGRAM CAPTION GENERATOR PAGE
# ======================================

@app.route('/instagram-caption-ai')
def instagram_caption_ai():
    return render_template('instagram-caption-ai.html')


# ======================================
# REEL HOOK AI PAGE
# ======================================

@app.route('/reel-hook-ai')
def reel_hook_ai():
    return render_template(
        'reel-hook-ai.html'
    )

# ======================================
# Youtube Title GENERATOR PAGE
# ======================================
@app.route('/youtube-title-generator')
def youtube_title_generator():
    return render_template('youtube-title-generator.html')

# ======================================
# EMAIL WRITER API
# ======================================

@app.route('/generate-email', methods=['POST'])
def generate_email():

    try:

        data = request.json

        purpose = data.get('purpose')
        tone = data.get('tone')
        recipient = data.get('recipient')
        points = data.get('points')

        prompt = f"""
        Write a professional email.

        Purpose: {purpose}
        Tone: {tone}
        Recipient: {recipient}
        Key Points: {points}

        Make it modern and professional.
        """

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        response = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=payload
        )

        result = response.json()

        print(result)

        if 'choices' not in result:
            return jsonify({"email": f"API Error: {result}"})

        email_text = result['choices'][0]['message']['content']

        return jsonify({
            "email": email_text
        })

    except Exception as e:

        return jsonify({
            "email": f"Error: {str(e)}"
        })

# ======================================
# YOUTUBE SUMMARY API
# ======================================

@app.route("/generate-summary", methods=["POST"])
def generate_summary():

    try:

        data = request.json

        youtube_url = data.get("youtube_url")

        parsed_url = urlparse(youtube_url)

        video_id = parse_qs(
            parsed_url.query
        ).get("v", [None])[0]

        # TRANSCRIPT API

        ytt_api = YouTubeTranscriptApi()

        transcript_list = ytt_api.list(video_id)

        transcript = transcript_list.find_transcript([
            'en',
            'te',
            'hi'
        ])

        fetched_transcript = transcript.fetch()

        # CONVERT TRANSCRIPT TO TEXT

        full_transcript = " ".join(
            [snippet.text for snippet in fetched_transcript]
        )

        # AI PROMPT

        prompt = f"""

        You are an expert YouTube video analyst.

        Analyze this transcript carefully and return STRICT JSON format only.

        JSON Format:
        {{
        "short_summary": "short summary here",
        "detailed_summary": "detailed summary here",
        "key_points": [
        "point 1",
        "point 2",
        "point 3"
        ],
        "action_items": [
        "action 1",
        "action 2",
        "action 3"
        ]
        }}

        Transcript:
        {full_transcript}

        """

        # GEMINI RESPONSE

        response = model.generate_content(prompt)

        raw_text = response.text

        cleaned_text = raw_text.replace(
            "```json",
            ""
        ).replace(
            "```",
            ""
        ).strip()

        parsed_data = json.loads(cleaned_text)

        return jsonify(parsed_data)

    except Exception as e:

        return jsonify({
            "short_summary": f"Error: {str(e)}"
        })



# ======================================
# VOICE NOTES AI API
# ======================================

@app.route("/generate-notes", methods=["POST"])
def generate_notes():

    try:

        import speech_recognition as sr
        from pydub import AudioSegment

        transcript = request.form.get("transcript")

        audio = request.files.get("audio")

        print(audio)
        print(transcript)

        # =====================================
        # AUDIO TO TEXT
        # =====================================

        if audio:

            os.makedirs("uploads", exist_ok=True)

            audio_path = os.path.join(
                "uploads",
                audio.filename
            )

            audio.save(audio_path)

            wav_path = audio_path.split(".")[0] + ".wav"

            sound = AudioSegment.from_file(audio_path)

            sound.export(
                wav_path,
                format="wav"
            )

            recognizer = sr.Recognizer()

            with sr.AudioFile(wav_path) as source:

                audio_data = recognizer.record(source)

                transcript = recognizer.recognize_google(
                    audio_data
                )

        # =====================================
        # VALIDATION
        # =====================================

        if not transcript:

            return jsonify({
                "notes": "Please upload audio or enter transcript"
            })

        # =====================================
        # GEMINI PROMPT
        # =====================================

        prompt = f"""

        You are an AI Voice Notes Assistant.

        Analyze the transcript and return CLEAN HTML only.

        Rules:
        - Do NOT use markdown
        - Do NOT use ###
        - Do NOT use ***
        - Do NOT use tables
        - Do NOT use separators
        - Do NOT add branding
        - Keep spacing professional
        - Use proper HTML tags only

        Return format EXACTLY like this:

        <h2>Summary</h2>
        <p>summary here</p>

        <h2>Key Notes</h2>
        <ul>
        <li>Point 1</li>
        <li>Point 2</li>
        <li>Point 3</li>
        </ul>

        <h2>Action Items</h2>
        <ul>
        <li>Action 1</li>
        <li>Action 2</li>
        </ul>

        Transcript:
        {transcript}

        """

        response = model.generate_content(prompt)

        notes = response.text

        return jsonify({
            "notes": notes
        })

    except Exception as e:

        return jsonify({
            "notes": f"Error: {str(e)}"
        })



# ======================================
# GENERATE LINKEDIN POST API
# ======================================

@app.route("/generate-linkedin-post", methods=["POST"])
def generate_linkedin_post():

    try:

        data = request.json

        topic = data.get("topic")
        audience = data.get("audience")
        tone = data.get("tone")
        length = data.get("length")
        cta = data.get("cta")
        hashtags = data.get("hashtags")

        prompt = f"""

        You are a professional LinkedIn ghostwriter.

        Create a high-performing LinkedIn post.

        INPUTS:

        Topic:
        {topic}

        Target Audience:
        {audience}

        Tone:
        {tone}

        Post Length:
        {length}

        CTA Style:
        {cta}

        Hashtag Count:
        {hashtags}

        REQUIREMENTS:

        - Strong hook in first line
        - Use short readable paragraphs
        - Human sounding
        - Professional but engaging
        - Add storytelling if suitable
        - Add emotional or authority-driven style
        - End with strong CTA
        - Add relevant hashtags
        - LinkedIn optimized formatting
        - Avoid robotic AI tone

        """

        response = model.generate_content(prompt)

        generated_post = response.text

        return jsonify({
            "post": generated_post
        })

    except Exception as e:

        return jsonify({
            "post": f"Error: {str(e)}"
        })

# ======================================
# GRAMMAR FIXER API
# ======================================
@app.route(
    '/fix-grammar',
    methods=['POST']
)
def fix_grammar():

    try:

        data = request.json

        text = data.get("text")

        if not text:

            return jsonify({
                "success": False,
                "message": "Please enter text."
            })

        prompt = f"""
        You are a professional grammar correction AI.

        Analyze the following text and return:

        1. Corrected Version
        2. Improved Professional Version

        Rules:
        - Fix grammar mistakes
        - Improve readability
        - Keep meaning same
        - Make writing professional
        - Return clean formatting

        TEXT:
        {text}
        """

        response = model.generate_content(
            prompt
        )

        result = response.text

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })


# ======================================
# INSTAGRAM CAPTION GENERATOR API
# ======================================

@app.route('/generate-caption', methods=['POST'])
def generate_caption():

    try:

        data = request.json

        topic = data.get('topic')
        style = data.get('style')

        if not topic:
            return jsonify({
                "success": False,
                "message": "Topic is required"
            })

        prompt = f"""

        You are an expert Instagram caption writer.

        Generate 5 viral Instagram captions.

        Topic:
        {topic}

        Caption Style:
        {style}

        Requirements:

        - Add engaging hooks
        - Add emojis
        - Add CTA
        - Add hashtags
        - Make captions highly engaging
        - Make captions mobile friendly
        - Use spacing properly
        - Keep captions human-like
        """

        response = model.generate_content(prompt)

        return jsonify({
            "success": True,
            "captions": response.text
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })


# ======================================
# REEL HOOK GENERATOR API
# ======================================
@app.route('/generate-reel-hooks', methods=['POST'])
def generate_reel_hooks():

    try:

        data = request.get_json()

        niche = data.get('niche')

        if not niche:

            return jsonify({
                "success": False,
                "message": "Please enter a niche/topic"
            })

        prompt = f"""

        You are a viral Instagram Reel hook creator.

        Generate 10 highly engaging,
        scroll-stopping reel hooks.

        Niche:
        {niche}

        Requirements:

        - Hooks must be short
        - Highly attention grabbing
        - Optimized for Instagram reels
        - Use creator psychology
        - Curiosity driven
        - Human written tone
        - Modern social media style
        - Each hook should be unique
        - Add emojis where needed
        - High Engagements

        """

        response = model.generate_content(
            prompt
        )

        return jsonify({
            "success": True,
            "hooks": response.text
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })

# ======================================
# YOUTUBE TITLE GENERATOR API
# ======================================

@app.route('/generate-youtube-titles', methods=['POST'])
def generate_youtube_titles():

    try:

        data = request.get_json()

        topic = data.get('topic')
        category = data.get('category')
        style = data.get('style')

        prompt = f"""
        You are a professional YouTube growth strategist.

        Generate 10 highly clickable YouTube titles.

        Topic:
        {topic}

        Category:
        {category}

        Style:
        {style}

        Requirements:
        - SEO optimized
        - High CTR
        - Curiosity-driven
        - Viral style
        - Human sounding
        - Add CTR score out of 100 beside each title

        Output format:

        1. Title Here — CTR Score: 95
        """

        response = model.generate_content(prompt)

        return jsonify({
            "success": True,
            "titles": response.text
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(debug=True)
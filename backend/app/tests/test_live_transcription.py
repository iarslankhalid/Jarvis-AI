import unittest
from unittest.mock import patch, MagicMock
import queue

from app.services.speech_service import * 

class TestLiveTranscription(unittest.TestCase):
    @patch("..services.speech_service.pyaudio.PyAudio")
    @patch("..services.speech_service.speech.SpeechClient")
    def test_live_transcription(self, mock_speech_client, mock_pyaudio):
        """
        Test the live_transcription function by mocking audio input and Google Speech API.
        """

        # Mock audio input data
        mock_audio_data = [
            b"non-silent-audio",  # Simulated audio data with speech
            b"silent-audio",  # Simulated silence
        ]

        # Create a fake queue to simulate audio data stream
        mock_queue = queue.Queue()
        for data in mock_audio_data:
            mock_queue.put(data)
        mock_queue.put(None)  # Simulate end of the audio stream

        # Mock PyAudio stream callback
        def mock_stream_callback(*args, **kwargs):
            return mock_queue.get()

        # Configure the mocked PyAudio instance
        mock_stream = MagicMock()
        mock_stream.is_active.return_value = True
        mock_pyaudio.return_value.open.return_value = mock_stream

        # Simulate the Google Speech-to-Text API response
        mock_response = MagicMock()
        mock_response.results = [
            MagicMock(
                is_final=True,
                alternatives=[
                    MagicMock(transcript="Hello, this is a test transcription.")
                ],
            )
        ]

        # Mock Google SpeechClient.streaming_recognize
        mock_speech_client.return_value.streaming_recognize.return_value = [mock_response]

        # Run the transcription function and validate the result
        with patch("your_module.audio_queue", mock_queue):
            transcription = live_transcription()

        self.assertEqual(transcription, "Hello, this is a test transcription.")
        mock_stream.stop_stream.assert_called_once()
        mock_stream.close.assert_called_once()

if __name__ == "__main__":
    unittest.main()

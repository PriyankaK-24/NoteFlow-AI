from app.services.llm_service import analyze_meeting


transcript = """
This is our weekly project meeting.

Priyanka will complete the backend API by Friday.
Rahul will prepare the frontend integration by Monday.

The team decided to use PostgreSQL for storing meeting data.

We will review the completed work next Tuesday.

One concern is that the deployment timeline may be tight.
"""


result = analyze_meeting(transcript)


print("\n===== MEETING ANALYSIS =====\n")

print("SUMMARY:")
print(result.summary)

print("\nKEY DECISIONS:")
for decision in result.key_decisions:
    print(f"- {decision}")

print("\nACTION ITEMS:")
for item in result.action_items:
    print(
        f"- {item.task} | "
        f"Owner: {item.owner} | "
        f"Deadline: {item.deadline}"
    )

print("\nTOPICS:")
for topic in result.topics:
    print(f"- {topic}")

print("\nRISKS:")
for risk in result.risks:
    print(f"- {risk}")
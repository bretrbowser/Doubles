/* ============================================================
   scenarios.js — the coaching content.

   Coordinates are in FEET (see court.js for the axes).
   Your team is always at the BOTTOM: your baseline is y = +39.
   Your deuce court is x > 0, your ad court is x < 0.
   The opponents' deuce court is x < 0 (mirrored).

   Each step is one decision:
     kind    'move'  -> tap where YOU should go
             'hit'   -> tap where the ball should land
     you/partner/opp1/opp2  positions at the moment of the decision
     ballPath  points the ball travels through before the freeze
     target    the coach's answer
     perfect   full-credit radius, in feet
     good      still-acceptable radius, in feet
     keyIdea   the one-line hint
     coach     the explanation shown after the answer

   A step's `you` is always the PREVIOUS step's target, so one bad
   guess never snowballs into the rest of the point.
   ============================================================ */

var SCENARIOS = [

/* ==========================================================
   EASY
   ========================================================== */
{
  id: 'e1', level: 'easy',
  title: 'Home Base at the Net',
  role: "You are the server's partner",
  situation: 'Your partner serves from the deuce court. Nothing has happened yet — which is exactly when most doubles points are decided.',
  takeaway: 'Split your box, two big steps off the net. The alley is one step away; the middle — where doubles points actually live — is one step the other way.',
  steps: [
    {
      kind: 'move',
      prompt: "You've drifted over to guard your alley. Reset: where is home base for the net player before the serve?",
      you: { x: -12.5, y: 6 },
      partner: { x: 7, y: 40.5 },
      opp1: { x: -10, y: -41 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 7, y: 40.5 }],
      target: { x: -7, y: 9 },
      perfect: 3, good: 7.5,
      keyIdea: 'Middle of the service box you are guarding — roughly halfway between the center line and your alley, and about two big steps off the net.',
      coach: "Stand in the middle of your service box: about 6–7 feet from the center service line and 8–9 feet from the net. From there the alley is one step and the middle is one step, and you can still turn and run down a lob. Hugging the alley defends 4.5 feet of court that opponents rarely aim at, and hands them the middle — which is where the majority of doubles balls are hit. Standing on top of the net gets you lobbed; standing back near the service line means the ball arrives at your feet."
    },
    {
      kind: 'move',
      prompt: 'Wide serve. It drags the returner outside the doubles alley and they are stretching, making contact below the height of the net. Where do you move?',
      you: { x: -7, y: 9 },
      partner: { x: 7, y: 40.5 },
      opp1: { x: -16.5, y: -38 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 7, y: 40.5 }, { x: -11.5, y: -18.5 }, { x: -16.5, y: -38 }],
      target: { x: -2.5, y: 6 },
      perfect: 3, good: 7,
      keyIdea: 'A stretched opponent has almost no angle left. Close the diagonal — forward and toward the middle.',
      coach: "Geometry just did your job for you. From outside the alley, hitting up from below net height, their sharp crosscourt lands in the alley or the net — it is not available. Almost everything they can actually produce comes back slow, through the middle or down the line. So move forward and in toward the center on a diagonal and take the ball out of the air. You are not 'leaving the alley open'; their position closed it. Volley into the open middle or down at the feet of the other net player."
    }
  ]
},

{
  id: 'e2', level: 'easy',
  title: "The Returner's Partner",
  role: "You are the returner's partner",
  situation: "They serve to your partner in the deuce court. You are the forgotten player in doubles — and the one with the most freedom to change the point.",
  takeaway: "Start on the service line. Then let the quality of your partner's return decide your feet: good return, you go forward; weak return, you go back.",
  steps: [
    {
      kind: 'move',
      prompt: "You're camped near the net waiting to volley. It's a first serve. Where should you actually start?",
      you: { x: -7, y: 8 },
      partner: { x: 10.5, y: 41 },
      opp1: { x: -7, y: -40.5 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: -7, y: -40.5 }],
      target: { x: -7, y: 21 },
      perfect: 3, good: 7.5,
      keyIdea: 'On the service line, splitting your box. Not committed forward, not committed back.',
      coach: "The service line is the neutral spot, and neutral is correct because you do not yet know if the return will be good. You are out of the strike zone of the server's partner, who would love nothing more than to volley at your shins. You are one step from advancing and one turn from retreating. You also have the best view on court of the center service line and the service line — calling the serve in or out is genuinely your job."
    },
    {
      kind: 'move',
      prompt: 'Your partner rips a low crosscourt return that dips at the server\'s feet. The server has to hit up. Where do you go?',
      you: { x: -7, y: 21 },
      partner: { x: 12, y: 40 },
      opp1: { x: -9, y: -36 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: -7, y: -40.5 }, { x: 3, y: 18 }, { x: 12, y: 40 }, { x: -9, y: -36 }],
      target: { x: -5.5, y: 13 },
      perfect: 3.5, good: 8,
      keyIdea: 'Low ball to them means they must hit up. When they hit up, you close.',
      coach: "Their contact point is your traffic light. Below the net means the ball has to travel upward to clear it, and an upward ball is an interceptable ball — so move in, to roughly halfway between the service line and the net, on a diagonal toward the middle. Do not sprint all the way to the net; you want to arrive and be still, split-stepping as they strike it. Move early enough to be balanced and late enough that you're not guessing."
    },
    {
      kind: 'move',
      prompt: 'Forced to hit up, the server floats a reply high through the middle of the court. Where do you go?',
      you: { x: -5.5, y: 13 },
      partner: { x: 12, y: 38 },
      opp1: { x: -8, y: -36 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: -9, y: -36 }, { x: -3, y: -12 }, { x: 0.5, y: 3 }],
      target: { x: -1, y: 7 },
      perfect: 3, good: 7,
      keyIdea: 'A middle ball belongs to whoever is closest to the net and moving forward. That is you.',
      coach: "Step across and take it — and say 'Mine!' before you move, not after. The middle is not a shared no-man's land; it belongs to whoever is closer to the net and travelling toward the ball, because they get to hit it earlier and from a higher contact point. Now pick your target: the feet of the opposing net player, or the gap between the two of them. Do not aim for the sideline; you don't need it."
    }
  ]
},

{
  id: 'e3', level: 'easy',
  title: 'Bad Return, Back Up',
  role: "You are the returner's partner",
  situation: "Half of good doubles is knowing when you are on defense. This point turns bad in about a second, and your feet have to admit it before your brain does.",
  takeaway: "When your team gives an opponent a ball they can hit down on, get out of the strike zone. Both back, split step, and lob your way back into the point.",
  steps: [
    {
      kind: 'move',
      prompt: 'Your partner floats the return high and short. The net player is already moving forward to put it away. Where do you go?',
      you: { x: -7, y: 21 },
      partner: { x: 11, y: 40 },
      opp1: { x: -7, y: -38 },
      opp2: { x: 5, y: -11 },
      ballPath: [{ x: -7, y: -40.5 }, { x: 4, y: 17 }, { x: 11, y: 40 }, { x: 4, y: -14 }],
      target: { x: -9, y: 38 },
      perfect: 4, good: 9,
      keyIdea: 'You are on defense. Get back to the baseline with your partner and give yourself time.',
      coach: "Standing on the service line in front of an opponent who is about to hit down on the ball is how doubles players get hit in the chest. Retreat on a diagonal to your half of the baseline. Both-back is the right defensive shape: from there you can actually see and react to an overhead, and you have the lob available to push them back and reset the point. Retreat first, then split step as they make contact — a split step while you're still running backwards does nothing."
    },
    {
      kind: 'move',
      prompt: 'The net player punches the volley hard and deep down the middle, between you and your partner. You are both back and both right-handed. Who takes it, and where do you go?',
      you: { x: -9, y: 38 },
      partner: { x: 11, y: 39 },
      opp1: { x: -7, y: -36 },
      opp2: { x: 4, y: -8 },
      ballPath: [{ x: 4, y: -14 }, { x: 2, y: 26 }, { x: 1.5, y: 38 }],
      target: { x: 1.5, y: 40.5 },
      perfect: 4, good: 9,
      keyIdea: 'Two right-handers, both back: the ad-court player takes the middle, because their forehand is in the middle.',
      coach: "You are the ad-court player, and for a right-hander in the ad court the forehand points at the center of the court — so the middle ball is yours by default. Move across and slightly back so you take it in front of you rather than reaching. Call it early and loudly. The alternative — both of you hesitating and watching a very takeable ball bounce between you — is the single most common way doubles teams lose points they should win."
    }
  ]
},

{
  id: 'e4', level: 'easy',
  title: 'Follow the Ball',
  role: 'You are at the net; your partner is back',
  situation: 'A crosscourt rally is running. You never touch the ball in this one — and you should still be moving on every single shot.',
  takeaway: 'Imagine a rope from the ball to you. When the ball moves, you move. Shift toward the side the ball is on, and back off a step when the ball is diagonally across from you.',
  steps: [
    {
      kind: 'move',
      prompt: 'The ball is deep in the corner on your side of the court — the opponent is about to hit from there. Where should you be standing as they make contact?',
      you: { x: -6, y: 9 },
      partner: { x: 11, y: 40 },
      opp1: { x: -12, y: -37 },
      opp2: { x: 8, y: -22 },
      ballPath: [{ x: 11, y: 40 }, { x: -12, y: -37 }],
      target: { x: -8.5, y: 8.5 },
      perfect: 3, good: 7,
      keyIdea: 'Ball on your side of the court: shift toward your alley. The down-the-line pass is now the short, easy shot for them.',
      coach: "Position yourself relative to the ball, not relative to the lines. With the ball directly up the court from you, the down-the-line drive is the shortest and most tempting shot they have, so slide a step toward your alley to take it away. You are still not standing in the alley — you're covering it from a step away, which is all it takes. Hold your depth; there's nothing here demanding you back up yet."
    },
    {
      kind: 'move',
      prompt: 'Their partner takes the next one from the middle of the court, near the center of the baseline. Where do you shift to?',
      you: { x: -8.5, y: 8.5 },
      partner: { x: 8, y: 39 },
      opp1: { x: -12, y: -36 },
      opp2: { x: 0, y: -37 },
      ballPath: [{ x: -12, y: -37 }, { x: 8, y: 39 }, { x: 0, y: -37 }],
      target: { x: -5, y: 9 },
      perfect: 3, good: 7,
      keyIdea: 'Ball in the middle: you come back toward the middle with it.',
      coach: "From the center of the court they have both corners available and no shot is obviously shorter than the others, so you return to a balanced position — the middle of your box. This is the part players skip. They set up once before the serve and then stand still, so by the fourth ball of a rally the geometry is completely wrong and they don't know why they keep getting passed. Every shot moves you."
    },
    {
      kind: 'move',
      prompt: 'Now the ball goes to their far corner — diagonally across the court from you. Where do you shift to?',
      you: { x: -5, y: 9 },
      partner: { x: 9, y: 40 },
      opp1: { x: -6, y: -36 },
      opp2: { x: 12, y: -37 },
      ballPath: [{ x: 0, y: -37 }, { x: 9, y: 39 }, { x: 12, y: -37 }],
      target: { x: -2.5, y: 11 },
      perfect: 3.5, good: 8,
      keyIdea: 'Ball diagonally across: slide toward the middle and give up a step of depth — the lob is the live threat now.',
      coach: "From the far diagonal, a down-the-line drive into your alley has to travel the longest distance over the highest part of the net — it's a low-percentage shot and you can afford to leave it. What they will do instead is drive through the middle or lob over you, since the crosscourt lob is the easiest lob in tennis. So shade toward the middle and drop back a step so the lob doesn't sail over your head. And your partner should be sliding the same direction: the two of you move as one unit, connected by that rope."
    }
  ]
},

{
  id: 'e5', level: 'easy',
  title: "The Server's Recovery",
  role: 'You are the server, staying back',
  situation: "You serve and stay. Where you stand for the return is the most-skipped decision in club doubles — most players jog back to the center mark out of habit.",
  takeaway: "Recover to the middle of the angles you are actually responsible for, not the middle of the court. Your partner owns the net on their side; you don't have to cover it.",
  steps: [
    {
      kind: 'move',
      prompt: 'You serve wide in the deuce court and stay back. The returner is out past the doubles alley. Before their contact, where do you recover to?',
      you: { x: 7, y: 40.5 },
      partner: { x: -7, y: 9 },
      opp1: { x: -15.5, y: -39 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 7, y: 40.5 }, { x: -12, y: -18 }, { x: -15.5, y: -39 }],
      target: { x: 4.5, y: 40.5 },
      perfect: 3, good: 6,
      keyIdea: "Don't run to the center mark. You only have to cover what your partner doesn't — the crosscourt reply and the lob.",
      coach: "The returner is stretched out wide on their deuce side. The two things that can realistically come to you are the crosscourt return, which lands on your deuce half, and a lob. The down-the-line return goes straight at your partner at the net — that's their ball, not yours. So recover a couple of steps to the deuce side of center and stay a step behind the baseline for time. Standing on the center mark means you are two steps too far from every ball that's actually coming."
    },
    {
      kind: 'move',
      prompt: 'The stretched returner can only chip it back short, landing near the middle of your service box. Where do you move to hit it?',
      you: { x: 4.5, y: 40.5 },
      partner: { x: -5, y: 8 },
      opp1: { x: -11, y: -39 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: -15.5, y: -39 }, { x: -2, y: 5 }, { x: 3, y: 16 }],
      target: { x: 3, y: 25 },
      perfect: 4, good: 9,
      keyIdea: 'A short ball is an invitation. Move forward and take it early — inside the service line, not behind it.',
      coach: "Short balls are the whole game. If you let it drop and hit from behind the baseline you've turned a gift into a neutral rally. Move forward, take it at a comfortable height around the service line, and hit it somewhere unpleasant — down the middle between them, or at the feet of the net player. Then keep going. The one thing you must not do is hit an approach shot and then stand there in the middle of the court admiring it."
    },
    {
      kind: 'move',
      prompt: 'You hit it firmly down the middle and follow it in. They are scrambling. Where do you stop and split step?',
      you: { x: 3, y: 25 },
      partner: { x: -4, y: 7 },
      opp1: { x: -4, y: -37 },
      opp2: { x: 7, y: -20 },
      ballPath: [{ x: 3, y: 25 }, { x: -1, y: -30 }, { x: -4, y: -37 }],
      target: { x: 1, y: 18 },
      perfect: 3.5, good: 8,
      keyIdea: 'Follow the line of your own shot, and split step wherever you are when they make contact.',
      coach: "You cannot reach the net in one run, and trying to is how you end up caught mid-stride while the ball goes past you. Move in along the line your shot travelled — that puts you in the middle of the angles they can reply with — and then stop and split step at the instant of their contact, wherever you have got to. Usually that's around or just inside the service line. What you do next depends entirely on their contact point: below the net, you close; above it, you hold."
    }
  ]
},

/* ==========================================================
   MEDIUM
   ========================================================== */
{
  id: 'm1', level: 'medium',
  title: 'The Poach',
  role: "You are the server's partner",
  situation: "Your partner has served three straight games where the returner blocked it crosscourt and nothing happened. Time to actually be at the net for a reason.",
  takeaway: 'Poach forward on a diagonal, go when they can no longer change direction, and remember that a poach is a switch — you keep going, your partner crosses behind you.',
  steps: [
    {
      kind: 'move',
      prompt: 'Serve down the T. The returner is late, takes a big swing, and the return is floating crosscourt at about net height. You are going. Where do you make contact with it?',
      you: { x: -7, y: 9 },
      partner: { x: 4, y: 40 },
      opp1: { x: -11, y: -40 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 5, y: 40.5 }, { x: -1.5, y: -18 }, { x: -11, y: -40 }, { x: -4, y: -8 }],
      target: { x: 0.5, y: 5 },
      perfect: 4, good: 9,
      keyIdea: 'Cut across on a diagonal that also takes you toward the net — never sideways.',
      coach: "Every step of a poach should gain you court in two directions at once. Moving straight sideways lets the ball keep dropping while you travel, and you end up volleying from behind the service line off your shoelaces — technically a poach, practically a mistake. Cutting forward and across means you meet the ball earlier, higher, and closer to the net, where the volley is easy and the angle is enormous. Go when the returner's head drops and the racket starts forward; after that moment they cannot redirect it."
    },
    {
      kind: 'hit',
      prompt: 'You have a chest-high volley in the middle of the court, both opponents deep on their deuce side. Where do you hit it?',
      you: { x: 0.5, y: 5 },
      partner: { x: 4, y: 40 },
      opp1: { x: -11, y: -38 },
      opp2: { x: -6, y: -21 },
      ballPath: [{ x: -4, y: -8 }, { x: 0.5, y: 5 }],
      target: { x: 8, y: -14 },
      perfect: 5, good: 11,
      keyIdea: 'Hit into the space they have both vacated — not back at the player you can see.',
      coach: "Both opponents have collapsed onto their deuce side. The whole ad half of their court is empty, and it is a big target that requires no precision at all. Take the ball in front of you and put it there, deep enough that neither of them can run it down. The classic error is volleying at the opponent nearest you because that's who you're looking at. Look at the space instead. Second-best option if they'd covered it: down at the feet of the closest opponent, forcing them to hit up again."
    },
    {
      kind: 'move',
      prompt: 'The volley is away and they are scrambling. Where do you finish up?',
      you: { x: 0.5, y: 5 },
      partner: { x: 4, y: 40 },
      opp1: { x: 9, y: -33 },
      opp2: { x: -6, y: -21 },
      ballPath: [{ x: 0.5, y: 5 }, { x: 8, y: -14 }, { x: 9, y: -30 }],
      target: { x: 6.5, y: 7 },
      perfect: 4, good: 9,
      keyIdea: 'A poach is a switch. You keep going to the other side; your partner crosses behind you.',
      coach: "You crossed the middle, so you now live on the deuce side and your partner takes the ad side — say 'Switch!' out loud as you go so they're already moving. The classic disaster is poaching and then drifting apologetically back to your original side, which leaves both of you standing on the same half of the court with a wide-open court beside you. Once you commit, commit. And close a step or two toward the net: they're scrambling, the reply will be weak, and you want to end this."
    }
  ]
},

{
  id: 'm2', level: 'medium',
  title: 'Middle of the Angle',
  role: 'You are the baseline player; your partner is at the net',
  situation: "You get yanked wide and have to hit a defensive ball. Where you recover to next decides whether the next shot is a rally ball or a winner past you.",
  takeaway: 'Recover to the middle of the angles available to whoever is hitting — that reference point moves every shot, and it is almost never the center mark.',
  steps: [
    {
      kind: 'move',
      prompt: 'You are dragged out past your doubles alley and scrape a defensive ball back crosscourt, deep to their corner. Where do you recover to?',
      you: { x: 16.5, y: 40 },
      partner: { x: -6, y: 9 },
      opp1: { x: -11, y: -37 },
      opp2: { x: 8, y: -21 },
      ballPath: [{ x: -10, y: -30 }, { x: 15, y: 33 }, { x: 16.5, y: 40 }, { x: -11, y: -37 }],
      target: { x: 4, y: 39.5 },
      perfect: 3.5, good: 8,
      keyIdea: 'Not the center mark. Split the angles they have — and remember your partner covers their side of the net.',
      coach: "Draw the two most extreme shots your opponent can hit from where they're standing, and stand halfway between where those two would land. From their deuce corner, that bisector sits close to the middle of your court — and because your partner at the net covers the ad side, you shade a step or two further to your deuce side. This is why 'recover to the center mark' fails: the center mark is a fixed point on a court where nothing is fixed. The reference is always the ball."
    },
    {
      kind: 'move',
      prompt: 'They go right back behind you, wide again, and this time all you can do is throw up a high defensive lob. Where do you go while it is in the air?',
      you: { x: 15, y: 34 },
      partner: { x: -6, y: 21 },
      opp1: { x: -8, y: -30 },
      opp2: { x: 8, y: -21 },
      ballPath: [{ x: -11, y: -37 }, { x: 13, y: 24 }, { x: 15, y: 34 }, { x: 2, y: -34 }],
      target: { x: 2, y: 41 },
      perfect: 4, good: 9,
      keyIdea: 'A high defensive lob buys you time. Spend it getting back to the middle and deep.',
      coach: "The entire point of a high lob is the three or four seconds it hangs there — that's a gift, and most players waste it standing where they hit it. Get back behind the baseline, near the middle, both feet set. Deep and central is right here because a good overhead can be angled to either corner and depth is what gives you the reaction time to chase one down. Your partner should be retreating alongside you; against an overhead, both back is the only sane shape."
    }
  ]
},

{
  id: 'm3', level: 'medium',
  title: 'Lobbed — The Switch',
  role: 'You are at the net; your partner is back',
  situation: 'The ball goes over your head. What happens in the next two seconds separates teams that have played together from teams that have not.',
  takeaway: 'When your partner runs down a lob behind you, you cross to the other side and retreat with them. Two players must never end up on the same half of the court.',
  steps: [
    {
      kind: 'move',
      prompt: 'They lob over your head, down your side. You cannot reach it; your partner calls "Switch!" and sprints across behind you to chase it. Where do you go?',
      you: { x: -7, y: 9 },
      partner: { x: 9, y: 39 },
      opp1: { x: -10, y: -36 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: -10, y: -36 }, { x: -9, y: 12 }, { x: -11, y: 35 }],
      target: { x: 7, y: 26 },
      perfect: 4, good: 9,
      keyIdea: 'Cross to the empty side, and give up depth as you go — your team is on defense now.',
      coach: "Your partner is running to the corner you just vacated, so that side is theirs and the other side is now yours: cross over. And retreat while you cross, because a player scrambling backwards to a lob is not about to hit you an attacking ball — they'll produce something defensive, and standing at the net in front of a defensive shot means the next ball arrives at your feet. Whoever chases the lob calls it; if nobody calls anything, the player with the better angle takes it and the other switches automatically."
    },
    {
      kind: 'move',
      prompt: 'Your partner just gets a racket on it and floats a short defensive slice back. Both opponents are closing to the net. Where do you go now?',
      you: { x: 7, y: 26 },
      partner: { x: -12, y: 38 },
      opp1: { x: -6, y: -9 },
      opp2: { x: 6, y: -9 },
      ballPath: [{ x: -11, y: 35 }, { x: -8, y: -14 }],
      target: { x: 7, y: 39 },
      perfect: 4, good: 9,
      keyIdea: 'They are both at the net and you handed them a weak ball. Both back — you need reaction time.',
      coach: "Two opponents at the net with a short ball to attack means the next shot arrives fast and downward. Get behind your baseline. Depth is time, and time is the only thing that lets you get a racket on a volley hit at 60 miles an hour. From back there you also have the two shots that beat a two-up team: a low dipper through the middle at their feet, and a lob over whichever of them is closest to the net. Standing in no-man's land offers neither."
    },
    {
      kind: 'move',
      prompt: 'They volley firmly down the middle between you. Remember you switched sides earlier — who takes this one?',
      you: { x: 7, y: 39 },
      partner: { x: -12, y: 38 },
      opp1: { x: -5, y: -8 },
      opp2: { x: 6, y: -8 },
      ballPath: [{ x: -8, y: -14 }, { x: -6, y: -8 }, { x: -1, y: 30 }, { x: -1.5, y: 38 }],
      target: { x: -11, y: 39.5 },
      perfect: 5, good: 10,
      keyIdea: 'You are in the deuce court now, so the middle forehand belongs to your partner. Cover your own side instead.',
      coach: "This is the part of switching that teams forget. Responsibilities swap with positions: your partner is now the ad-court player, so for two right-handers the middle ball is theirs, taken with the forehand. Your job is to hold your side and not converge on a ball that isn't yours — two players lunging at the same volley leaves an entire half of the court empty. Call it early, trust the call, and cover what's left."
    }
  ]
},

{
  id: 'm4', level: 'medium',
  title: 'Attack the Second Serve',
  role: 'You are the returner',
  situation: 'Second serve, and it is short. This is the single biggest opportunity that repeats itself in doubles, and most players stand behind the baseline and let it go by.',
  takeaway: 'Move forward before the bounce, take the short second serve on the rise, hit it low at their feet, and follow it in. Second serves are how you break.',
  steps: [
    {
      kind: 'move',
      prompt: 'The second serve kicks up short, bouncing barely past the middle of the service box. Where do you meet the ball?',
      you: { x: 10.5, y: 41 },
      partner: { x: -7, y: 21 },
      opp1: { x: -7, y: -40 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: -7, y: -40 }, { x: 4, y: 12 }],
      target: { x: 6, y: 23 },
      perfect: 4, good: 9,
      keyIdea: 'Start moving before it bounces. Take it around the service line, on the way up.',
      coach: "If you wait behind the baseline for a short kick serve, you meet it after the peak, dropping and slow, and the best you can do is push it back. Step in as the serve crosses the net and take it on the rise near the service line, where the ball is still coming up into your strike zone and you're inside the court. You don't need a big swing — the ball's own pace plus your forward momentum does the work. Short and central is a green light; go."
    },
    {
      kind: 'hit',
      prompt: 'You are inside the baseline with a comfortable ball. The server stayed back; their partner is at the net on your left. Where do you hit the return?',
      you: { x: 6, y: 23 },
      partner: { x: -7, y: 21 },
      opp1: { x: -7, y: -39 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: 4, y: 12 }, { x: 6, y: 23 }],
      target: { x: -9, y: -33 },
      perfect: 5, good: 11,
      keyIdea: 'Low and deep crosscourt at the server, away from the net player. Keep it away from the volleyer and make the server hit up.',
      coach: "Crosscourt and low is the percentage play: it travels over the lowest part of the net, it's the longest diagonal on the court so you have margin, and it goes nowhere near the net player who is waiting to poach. Make it dip at the server's feet as they move in — you want them hitting upward, which is what gives you and your partner permission to come forward. Going down the line at the net player's alley is the flashy option and it loses more points than it wins."
    },
    {
      kind: 'move',
      prompt: 'The return is a good one and you are already leaning in. Do you follow it? Where do you split step?',
      you: { x: 6, y: 23 },
      partner: { x: -6, y: 14 },
      opp1: { x: -9, y: -35 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: 6, y: 23 }, { x: -9, y: -33 }, { x: -9, y: -36 }],
      target: { x: 6.5, y: 19 },
      perfect: 3.5, good: 8,
      keyIdea: 'Follow the line of your shot, and split step at their contact — not a moment later.',
      coach: "Yes, you follow it — a low return that forces them to hit up is exactly the ticket to the net you were looking for, and coming in behind it turns the point around. But arrive under control. Move a couple of steps in along the path of your own shot, then split step at the moment their racket meets the ball. Everyone remembers to split step; almost nobody times it right. Split as they hit, not after you see where the ball is going, or you're a full beat late to everything."
    }
  ]
},

{
  id: 'm5', level: 'medium',
  title: 'Both Up: Owning the Middle',
  role: 'You and your partner are both at the net',
  situation: "You've both got to the net, which is where doubles is won. Now you have to hold it — and the space between you is what they'll aim at.",
  takeaway: 'Two at the net move as one unit: same distance apart, forward together, back together. When your partner has to hit up, you drop back with them.',
  steps: [
    {
      kind: 'move',
      prompt: 'They are both back. One of them threads a dipping ball at your partner\'s feet, and your partner is going to have to volley up from below the net. Where do you go?',
      you: { x: -6, y: 9 },
      partner: { x: 6, y: 9 },
      opp1: { x: -12, y: -37 },
      opp2: { x: 4, y: -38 },
      ballPath: [{ x: -12, y: -37 }, { x: 5, y: 6 }],
      target: { x: -4, y: 12 },
      perfect: 3.5, good: 8,
      keyIdea: 'Your partner has to hit up, so your team is briefly on defense. Slide to the middle and give up a step.',
      coach: "When your partner is forced to volley upward, the next ball is coming back hard and probably down. Back up a step so it doesn't arrive at your shoelaces, and slide toward the middle to shrink the gap between the two of you — the middle is the target any decent opponent picks against a two-up team. Two at the net are a unit with a fixed rope between them: when one gets pushed back, both get pushed back. One player charging the net while their partner retreats is just a hole with two people standing around it."
    },
    {
      kind: 'move',
      prompt: 'Your partner digs out a good deep volley anyway and the reply floats back up the middle, above net height. Where do you go?',
      you: { x: -4, y: 12 },
      partner: { x: 6, y: 11 },
      opp1: { x: -10, y: -38 },
      opp2: { x: 4, y: -38 },
      ballPath: [{ x: 5, y: 6 }, { x: -9, y: -34 }, { x: -1, y: 4 }],
      target: { x: -1.5, y: 6 },
      perfect: 3, good: 7,
      keyIdea: 'Ball above the net means attack. Close in and take the middle.',
      coach: "Their contact point flipped the point back to you, so move forward and across and take the ball out of the air in front of you. Call it — you're moving toward the middle and closer to the net, so it's yours. Then hit it into the gap between them or down at the feet of whichever one is closer. Against two players at the back of the court, the space between them is enormous and needs no accuracy at all; you don't have to hit a line to win this."
    }
  ]
},

/* ==========================================================
   HARD
   ========================================================== */
{
  id: 'h1', level: 'hard',
  title: 'The I-Formation',
  role: "You are the server's partner",
  situation: "The returner has been drilling crosscourt returns past your hip all afternoon. So you take the middle away from them before they hit it.",
  takeaway: 'In the I you hide, then commit to the pre-agreed side at contact — no reading, no reacting. The server covers the other half. Signals are non-negotiable.',
  steps: [
    {
      kind: 'move',
      prompt: 'You are playing an I-formation. Where do you crouch before your partner serves?',
      you: { x: -7, y: 9 },
      partner: { x: 2, y: 40.5 },
      opp1: { x: -10, y: -40 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 2, y: 40.5 }],
      target: { x: 0, y: 5.5 },
      perfect: 2.5, good: 6,
      keyIdea: 'Crouched low, straddling the center service line, close to the net.',
      coach: "You straddle the center service line about five feet off the net and get genuinely low — low enough that your partner can see the service box over your back, because you are standing directly in their serving line. The I does two things at once: it erases the crosscourt return, which is the return every club player is most comfortable hitting, and it hides which half you'll cover until after the ball is struck. Half of its value is that the returner is thinking about you instead of the ball."
    },
    {
      kind: 'move',
      prompt: 'You signalled that you are going to the deuce side, and your partner serves down the T. The instant the ball passes you — where do you go?',
      you: { x: 0, y: 5.5 },
      partner: { x: 2, y: 40.5 },
      opp1: { x: -8, y: -40 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 2, y: 40.5 }, { x: -1.5, y: -19 }, { x: -8, y: -40 }],
      target: { x: 5, y: 6 },
      perfect: 3.5, good: 8,
      keyIdea: 'Commit to the side you signalled and close toward the net. Do not wait to see the return.',
      coach: "You move on the signal, not on the ball — that's the whole contract. If you start reading the return you'll be caught in the middle covering nothing, and worse, your partner won't know which half is theirs. Break to the deuce side and gain ground toward the net as you go, because the T serve you paired this with forces the return through the small area you're travelling into. The server covers the ad half; that was agreed before the point. When it goes wrong, it went wrong because someone improvised."
    },
    {
      kind: 'move',
      prompt: 'The returner blocks it into the middle and it hangs. You are already moving that way. Where do you take it?',
      you: { x: 5, y: 6 },
      partner: { x: -6, y: 38 },
      opp1: { x: -8, y: -38 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: -8, y: -40 }, { x: -1, y: -9 }, { x: 2, y: 2 }],
      target: { x: 3, y: 4 },
      perfect: 3, good: 7,
      keyIdea: 'Take it early and high, in front of you, still moving forward.',
      coach: "This is exactly the ball the formation was designed to produce — a hesitant return into the space you're already running through. Meet it in front of you and above the net so you can hit down, rather than letting it drop while you get comfortable. Look at where the opponents are before you strike: the returner is out of position on their deuce side and their partner is stuck on the service line, so the deep ad corner behind them is completely open."
    }
  ]
},

{
  id: 'h2', level: 'hard',
  title: 'Australian Formation',
  role: 'You are the server',
  situation: "Their best shot all day has been the crosscourt return. So you stand on that side of the court and dare them to hit anywhere else.",
  takeaway: 'Australian erases the crosscourt return and hands them the down-the-line. That shot is yours to cover, and you have to start covering it the instant you serve.',
  steps: [
    {
      kind: 'move',
      prompt: 'You are serving to the deuce court in Australian formation — your partner is already lined up in the deuce service box, on the same side as you. Where do you stand to serve?',
      you: { x: 7, y: 40.5 },
      partner: { x: 6, y: 9 },
      opp1: { x: -10, y: -40 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 7, y: 40.5 }],
      target: { x: 2, y: 40.5 },
      perfect: 3, good: 7,
      keyIdea: 'Right next to the center mark — you have a long way to run after you hit it.',
      coach: "Stack both of you on the deuce side and the crosscourt return simply has nowhere to land. But that means your entire ad half is empty, and you are the only one who can cover it. Serve from close to the center mark to shorten the sprint. It also narrows the serve angle you have available, which is fine — in Australian the serve you want is down the T anyway, so the return has to travel across the front of your onrushing partner."
    },
    {
      kind: 'move',
      prompt: 'You serve down the T and the returner is winding up. Where are you going?',
      you: { x: 2, y: 40.5 },
      partner: { x: 6, y: 9 },
      opp1: { x: -10, y: -40 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 2, y: 40.5 }, { x: -1.5, y: -19 }, { x: -10, y: -40 }],
      target: { x: -8, y: 38 },
      perfect: 4, good: 9,
      keyIdea: 'Cross to the empty ad side immediately and split step as they contact the ball.',
      coach: "The moment the serve leaves your racket, run. Australian is a deliberate trade: you take away their favourite shot and give them the down-the-line, and the down-the-line is your responsibility to cover. Get across to your ad half, behind the baseline, and split step as they strike it — you have to be stopped and balanced or the extra step you gained by leaving early is wasted. Servers who admire the serve for half a second before crossing get passed down the line every time, and then blame the formation."
    },
    {
      kind: 'hit',
      prompt: 'They go down the line as expected. You get there in time and have a normal groundstroke. Where do you hit it?',
      you: { x: -12, y: 36 },
      partner: { x: 6, y: 8 },
      opp1: { x: -12, y: -38 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: -10, y: -40 }, { x: -12, y: 20 }, { x: -12, y: 36 }],
      target: { x: -4, y: -24 },
      perfect: 5, good: 11,
      keyIdea: 'Crosscourt would fly straight past their net player. Go back behind the returner, or low through the middle.',
      coach: "Careful here — the instinct is to hit crosscourt, but their net player is sitting on that side of the court waiting for exactly that ball. The returner has committed forward and to their alley, so the space is behind them, back through the middle and deep. A low ball through the middle also keeps it away from the volleyer and forces whoever gets it to hit up. If neither is on, the lob over their net player is a perfectly respectable third option."
    }
  ]
},

{
  id: 'h3', level: 'hard',
  title: 'Cracking Two at the Net',
  role: 'You are back; your partner is back',
  situation: 'They are both at the net and you are both pinned back. Most club players panic here and hit harder. That is the wrong answer.',
  takeaway: 'Against two at the net: aim low through the middle to take away their angles, watch their contact point, and step in the moment one of them has to volley up.',
  steps: [
    {
      kind: 'move',
      prompt: 'They volley deep into your partner\'s corner. Your partner is about to hit. Where should you be as they make contact?',
      you: { x: -9, y: 40 },
      partner: { x: 11, y: 41 },
      opp1: { x: -6, y: -9 },
      opp2: { x: 6, y: -9 },
      ballPath: [{ x: -6, y: -9 }, { x: 10, y: 34 }, { x: 11, y: 41 }],
      target: { x: -3.5, y: 40 },
      perfect: 4, good: 9,
      keyIdea: 'Shift toward the middle and stay deep — you need reaction time, and the reply is most likely coming at you.',
      coach: "Two volleyers close to the net can't create much angle unless you give them a high ball, so their most likely reply is a firm volley into the space between you or straight at the player who didn't just hit. That's you. Slide toward the middle to shrink the gap and stay behind the baseline, because against a volley struck from ten feet away the only defence you have is distance. Do not creep forward here out of eagerness; that's how you get a ball through your hands."
    },
    {
      kind: 'hit',
      prompt: 'Instead the ball comes to you, waist high and comfortable. Both of them are close to the net. Where do you hit it?',
      you: { x: -3.5, y: 40 },
      partner: { x: 11, y: 39 },
      opp1: { x: -6, y: -8 },
      opp2: { x: 6, y: -8 },
      ballPath: [{ x: 6, y: -8 }, { x: -3, y: 33 }, { x: -3.5, y: 40 }],
      target: { x: -1, y: -17 },
      perfect: 5, good: 11,
      keyIdea: 'Low, through the middle, dipping at their feet. Take their angles away rather than trying to beat them for pace.',
      coach: "A ball driven up the middle robs both volleyers of angle — from the center of the court there simply isn't a sharp cross available to them, and it also invites the two of them to hesitate over who takes it. Aim to make it dip at their feet, which forces someone to volley up and hands the initiative straight back to you. Trying to blast a winner past two players standing eight feet from the net is a shot you'll make once in ten; the low middle ball works every point."
    },
    {
      kind: 'move',
      prompt: 'It dips beautifully. The player in the middle has to scoop it up from below the net and it floats back short. Where do you go?',
      you: { x: -3.5, y: 40 },
      partner: { x: 11, y: 38 },
      opp1: { x: -3, y: -8 },
      opp2: { x: 6, y: -9 },
      ballPath: [{ x: -1, y: -17 }, { x: -2, y: -7 }, { x: 0, y: 22 }],
      target: { x: 0, y: 24 },
      perfect: 4, good: 9,
      keyIdea: 'They hit up and short. Sprint in and take it early, above the net if you can.',
      coach: "This is the payoff and it lasts about one second. The instant you see an opponent's contact point drop below the net, start moving forward — don't wait to see where the ball lands. Get to it early enough to strike it at or above net height, and now you can hit down at their feet or roll it into the open alley. Then keep coming: you've turned the point, and the net belongs to whoever takes it first."
    }
  ]
},

{
  id: 'h4', level: 'hard',
  title: 'Serve and Volley: The Low First Volley',
  role: 'You are the server, coming in',
  situation: "You're serving and volleying. The first volley is almost never the easy one — and what your feet do after it decides the point.",
  takeaway: 'Split step where you actually are, not where you wish you were. Volley up, hold your ground; volley down, close the net.',
  steps: [
    {
      kind: 'move',
      prompt: 'You serve down the T from the deuce court and follow it in. The returner is preparing. Where do you split step?',
      you: { x: 7, y: 40.5 },
      partner: { x: -7, y: 9 },
      opp1: { x: -8, y: -40 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: 7, y: 40.5 }, { x: -1.5, y: -19 }, { x: -8, y: -40 }],
      target: { x: 3.5, y: 23 },
      perfect: 4, good: 9,
      keyIdea: 'Around the service line, drifting toward the line your serve travelled on. You cannot get further than that.',
      coach: "Nobody covers 40 feet between the serve and the return; you'll get three or four hard strides in, which puts you a stride behind the service line. Stop there and split step at their contact — running through the split is the single most common serve-and-volley error, because you can't change direction while your weight is still going forward. Drift toward the line of your serve as you come, since a T serve makes the reply most likely through the middle."
    },
    {
      kind: 'move',
      prompt: 'The return dips and you have to half-volley it up from your shoelaces. It lands deep but you had to hit up. Where do you go now?',
      you: { x: 3.5, y: 23 },
      partner: { x: -7, y: 9 },
      opp1: { x: -9, y: -38 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: -8, y: -40 }, { x: 2, y: 20 }, { x: 3.5, y: 23 }, { x: -8, y: -36 }],
      target: { x: 3, y: 19.5 },
      perfect: 3.5, good: 8,
      keyIdea: 'You hit up, so you do not close. Take half a step, re-split, and wait for a better ball.',
      coach: "The rule that separates good volleyers from busy ones: if you had to hit the ball upward, do not advance. They now have a ball above net height and you'd be charging straight into a pass or a volley at your feet. Take at most a small adjusting step, re-split as they strike it, and accept that this ball was about survival. The net is a place you earn with a good volley, not a place you run to because you happen to be facing that direction."
    },
    {
      kind: 'move',
      prompt: 'Your deep half-volley did its job — the reply is a floater above the net. Where do you go?',
      you: { x: 3, y: 19.5 },
      partner: { x: -6, y: 8 },
      opp1: { x: -9, y: -37 },
      opp2: { x: 7, y: -21 },
      ballPath: [{ x: -8, y: -36 }, { x: -2, y: -6 }, { x: 2, y: 8 }],
      target: { x: 2, y: 7.5 },
      perfect: 3.5, good: 8,
      keyIdea: 'Above the net means go. Close hard and take it out of the air.',
      coach: "Now you close, and you close all the way — this is the ball you accepted the ugly half-volley to earn. Move forward through the shot rather than reaching for it from where you're standing, so that contact happens above the net and in front of you and you can hit down. From that position their net player's feet and the open ad court are both available, and either one ends the point. Green light and red light are both decided by their contact point, every single time."
    }
  ]
},

{
  id: 'h5', level: 'hard',
  title: 'Beating the Poacher',
  role: 'You are the returner',
  situation: "Their net player has poached two returns in a row for winners and is grinning about it. You have one return to make them stop.",
  takeaway: 'Punish a poacher by moving in a step, hitting behind them down the line, or lobbing them. Do it once and they stop leaving early for the rest of the match.',
  steps: [
    {
      kind: 'move',
      prompt: 'You are returning in the deuce court and their net player has broken early on both of the last two returns. Adjust your starting position.',
      you: { x: 10.5, y: 41 },
      partner: { x: -7, y: 21 },
      opp1: { x: -7, y: -40.5 },
      opp2: { x: 7, y: -9 },
      ballPath: [{ x: -7, y: -40.5 }],
      target: { x: 7, y: 40 },
      perfect: 3.5, good: 8,
      keyIdea: 'Step in toward the middle. It shortens the down-the-line return and lets you see the poacher sooner.',
      coach: "Move a couple of steps toward the center and a half-step forward. Standing closer to the middle shortens the down-the-line return you're about to hit, and taking the ball earlier means you see the net player break out of the corner of your eye while you can still do something about it. It costs you a little coverage of the wide serve, which is a trade worth making against an opponent who has already told you exactly what they're going to do."
    },
    {
      kind: 'hit',
      prompt: 'The serve comes down the T and out of the corner of your eye you see the net player break early toward the middle. Where do you hit the return?',
      you: { x: 6, y: 38 },
      partner: { x: -7, y: 21 },
      opp1: { x: -7, y: -38 },
      opp2: { x: 1, y: -8 },
      ballPath: [{ x: -7, y: -40.5 }, { x: 1.5, y: -18.5 }, { x: 6, y: 38 }],
      target: { x: 10, y: -30 },
      perfect: 5, good: 11,
      keyIdea: 'Behind them. They left their half of the court and nobody is covering it.',
      coach: "A poacher who breaks early has abandoned an entire half of the court, and the server can't cover it because they're on the other side. Hit down the line into the space behind them — and note that it doesn't need to be a great shot, just one that lands in, because there is nobody there. Keep it low and reasonably deep. The value of this return isn't only the point: after it, that net player hesitates on every return for the rest of the match, and your ordinary crosscourt returns get easy again."
    },
    {
      kind: 'move',
      prompt: 'The return lands behind them and both opponents are scrambling across the court. Where do you go?',
      you: { x: 6, y: 38 },
      partner: { x: -6, y: 18 },
      opp1: { x: 4, y: -36 },
      opp2: { x: 2, y: -12 },
      ballPath: [{ x: 6, y: 38 }, { x: 10, y: -30 }, { x: 8, y: -35 }],
      target: { x: 8, y: 22 },
      perfect: 4, good: 9,
      keyIdea: 'Follow it in. Two scrambling opponents will not produce a passing shot — they will produce a floater.',
      coach: "Come forward behind it and split step around the service line on the same side you hit to. Opponents running sideways and backwards hit weak, high balls, and the only way to punish a weak high ball is to already be at the net when it arrives. Your partner should be closing with you. And this is the moment the match tilts: you've taken away their best pattern and now you're the team dictating where the ball goes."
    }
  ]
}

];

var LEVELS = [
  { id: 'easy',   name: 'Easy',   badge: '1', blurb: 'Starting positions and the basic unit moves. The stuff that wins points before anyone is trying.' },
  { id: 'medium', name: 'Medium', blurb: 'Poaching, switching, angles, and attacking the second serve.', badge: '2' },
  { id: 'hard',   name: 'Hard',   blurb: 'Formations, transition, and dismantling a team that is already at the net.', badge: '3' }
];

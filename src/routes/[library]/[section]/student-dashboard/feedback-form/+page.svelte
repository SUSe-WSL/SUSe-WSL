<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tabs from '$lib/components/ui/tabs/index';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import EmojiButton from '$lib/components/ui/emoji-button/emoji-button.svelte';
	import LikertButton from '$lib/components/ui/likert-button/likert-button.svelte';
	import { createBugReport, createFeedback } from '../../../../supabase/Feedback';
	import toast from 'svelte-5-french-toast';
	import { goto } from '$app/navigation';
	import { UserStore } from '$lib/stores/UserStore';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	const surveyAnswers: { [key: string]: string } = {
		q1_1_1: '',
        q5_2: '',
	};

	const surveyQuestions: Array<{
		category: string;
		questions: { [key: string]: string };
		completeQuestions: number;
	}> = [
		{
			category: 'Category',
			questions: {
				q1_1_1: "Question"
			},
			completeQuestions: 0
		}
	];

	const bugReportAnswers: { [key: string]: string } = {
		q1: '',
		q2: ''
	};

	let pageNum: number = 0;
    let completeAdditionalQuestions: number = 0;

	let surveyCompleteDialog: boolean = false;
    let bugReportCompleteDialog: boolean = false;
	let completeSurvey: boolean = true;
	let completeBugReport: boolean = true;

	async function submitFeedbackForm() {
		// stores library user answers to database
		for (const [key, value] of Object.entries(surveyAnswers)) {
			if (!value && key != 'q5_2') {
				completeSurvey = false;
				return;
			}
		}
		completeSurvey = true;
		let feedback = { ...surveyAnswers, lib_user_id: parseInt($UserStore.formData.lib_user_id) };

		const { error } = await createFeedback(feedback);

		if (error) {
			toast.error(`Error with submitting feedback: ${error}`);
		} else {
			surveyCompleteDialog = true;
		}
	}

	async function submitBugReport() {
		// stores library user answers to database
		for (const [key, value] of Object.entries(bugReportAnswers)) {
			if (!value) {
				completeBugReport = false;
				return;
			}
		}
		completeBugReport = true;
		let bugReport = { ...bugReportAnswers, lib_user_id: parseInt($UserStore.formData.lib_user_id) };

		const { error } = await createBugReport(bugReport);

		if (error) {
			toast.error(`Error with submitting bug report: ${error}`);
		} else {
			bugReportCompleteDialog = true;
		}
	}

	function nextPage() {
		// turns to the next page in the survey
		if (pageNum < surveyQuestions.length) {
			pageNum++;
			goto('./feedback-form#survey-title');
		}
	}

	function prevPage() {
		// turns to the next page in the survey
		if (pageNum > 0) {
			pageNum--;
			goto('./feedback-form#survey-title');
		}
	}

    function resetForms() {
        // Resets the feedback and bug report forms
        surveyCompleteDialog = false; 
        bugReportCompleteDialog = false;
        pageNum = 0;
        for (const key of Object.keys(surveyAnswers)) {
            surveyAnswers[key] = '';
        }

        for (const key of Object.keys(bugReportAnswers)) {
            bugReportAnswers[key] = '';
        }
    }
</script>

<div class="flex h-full w-full flex-col gap-10 p-10 md:p-20">
	<!-- Title -->
	<div class="flex w-full flex-col gap-4">
		<h1 class="text-3xl font-medium">We would love to hear your thoughts!</h1>
		<p class="text-slate-500">
			Any feedback makes this website better.
		</p>
	</div>

	<!-- Tabs -->
	<Tabs.Root value="feedback" class="">
		<Tabs.List class="grid max-w-[300px] grid-cols-2">
			<Tabs.Trigger value="feedback">Survey</Tabs.Trigger>
			<Tabs.Trigger value="bug-report">Bug Report</Tabs.Trigger>
		</Tabs.List>
		<!-- Feedback Form -->
		<Tabs.Content value="feedback">
			<Card.Root>
				<Card.Header>
					<Card.Title id="survey-title">Survey</Card.Title>
					<Card.Description>
                    Description
                    </Card.Description>
				</Card.Header>

				<Card.Content class="flex flex-col">
					{#key pageNum}
						{#if pageNum < surveyQuestions.length}
							<h3 class="text-lg font-semibold">{surveyQuestions[pageNum].category}</h3>
							<div class="grid grid-cols-2 py-4">
								<!-- Questions -->
								<div class="flex flex-col gap-6">
									{#each Object.keys(surveyQuestions[pageNum].questions) as key, i}
										<div class="flex flex-col gap-1.5">
											<Label for="feedback" class="text-base"
												>{i + 1}. {surveyQuestions[pageNum].questions[key]}</Label
											>
											{#if !completeSurvey && !surveyAnswers[key] && key != 'q5_2'}
												<p class="text-sm text-destructive">
													Please respond to the statement/question above.
												</p>
											{/if}
											<LikertButton
												bind:answer={surveyAnswers[key]}
												on:change={(_) => surveyQuestions[pageNum].completeQuestions++}
												questionName={key}
											/>
										</div>
									{/each}
								</div>

								<!-- Sticky -->
								{#key surveyQuestions[pageNum].completeQuestions}
									<div class="sticky top-[30%] max-h-min place-items-center text-center">
										<p class="text-[50px] font-semibold">
											{surveyQuestions[pageNum].completeQuestions}/{Object.keys(
												surveyQuestions[pageNum].questions
											).length}
										</p>
										<p>Questions left in this section</p>
										{#if surveyQuestions[pageNum].completeQuestions == Object.keys(surveyQuestions[pageNum].questions).length}
											<p>You have completed this section! Here's an uiiau cat.</p>
											<img
												alt="Spinning cat GIF"
												src={'../../../misc/cat-spinning.gif'}
												class="size-32"
											/>
										{/if}
									</div>
								{/key}
							</div>
						{:else if pageNum == surveyQuestions.length}
                            <h3 class="text-lg font-semibold">Overall Feedback</h3>
                            <div class="grid grid-cols-2 py-4">
                                <!-- Additional Questions -->
                                <div class="flex flex-col gap-6">
                                    <div class="grid w-full gap-1.5">
                                        <Label for="feedback" class="text-base"
                                            >How satisfied are you with the website overall?</Label
                                        >
                                        {#if !completeSurvey && !surveyAnswers.q5_1}
                                            <p class="text-sm text-destructive">
                                                Please respond to the statement/question above.
                                            </p>
                                        {/if}
                                        <EmojiButton bind:rating={surveyAnswers.q5_1} on:change={(_) => completeAdditionalQuestions++}/>
                                    </div>
    
                                    <div class="grid w-full gap-1.5">
                                        <Label for="feedback" class="text-base"
                                            >Is there anything you would like to tell the developers about the website? (Optional)</Label
                                        >
                                        <Textarea
                                            placeholder="Your response may be a feature request or words of encouragement."
                                            bind:value={surveyAnswers.q5_2}
                                        />
                                    </div>
                                </div>

                                <!-- Sticky -->
                                {#key completeAdditionalQuestions}
									<div class="sticky top-[30%] max-h-min place-items-center text-center">
										<p class="text-[50px] font-semibold">
											{completeAdditionalQuestions}/1
										</p>
										<p>Questions left in this section</p>
										{#if completeAdditionalQuestions == 1}
											<p>You have completed this section! Here's an uiiau cat.</p>
											<img
												alt="Spinning cat GIF"
												src={'../../../misc/cat-spinning.gif'}
												class="size-32"
											/>
										{/if}
									</div>
								{/key}
                            </div>
						{/if}
					{/key}
				</Card.Content>

				<Card.Footer>
					<div class="flex items-center gap-2">
						<Button variant="outline" on:click={prevPage}><ChevronLeft /></Button>
						<p class="text-sm text-muted-foreground">
							Page {pageNum + 1} of {surveyQuestions.length + 1}
						</p>
						<Button variant="outline" on:click={nextPage}><ChevronRight /></Button>
						{#if pageNum == surveyQuestions.length}
							<Button class="max-w-[150px]" on:click={submitFeedbackForm}>Submit Survey</Button>
						{/if}
					</div>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<!-- Bug Report -->
		<Tabs.Content value="bug-report">
			<Card.Root>
				<Card.Header>
					<Card.Title>Bug Report</Card.Title>
					<Card.Description>
						We are working hard to make this website better! We appreciate any bugs 🐛 that you can find.
					</Card.Description>
				</Card.Header>

				<Card.Content class="flex flex-col gap-4 space-y-2">
					<div class="grid w-full gap-1.5">
						<Label for="bug-report">What issue did you encounter?</Label>
						{#if !completeBugReport && !bugReportAnswers.q1}
							<p class="text-sm text-destructive">
								Please respond to the statement/question above.
							</p>
						{/if}
						<Textarea
							placeholder="Please be as decriptive as you can when describing the bug you encountered."
							bind:value={bugReportAnswers.q1}
						/>
					</div>

					<div class="grid w-full gap-1.5">
						<Label for="bug-steps">Can you describe the steps you took to cause the bug?</Label>
						{#if !completeBugReport && !bugReportAnswers.q2}
							<p class="text-sm text-destructive">
								Please respond to the statement/question above.
							</p>
						{/if}
						<Textarea
							placeholder="This will let the developers recreate the bug and find what's causing the issue faster!"
							bind:value={bugReportAnswers.q2}
						/>
					</div>
				</Card.Content>
				<Card.Footer>
					<Button class="max-w-[150px]" on:click={submitBugReport}>Send Bug Report</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>

<!-- Survey Dialog -->
<Dialog.Root bind:open={surveyCompleteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>You have completed the survey! 🎉</Dialog.Title>
			<Dialog.Description>
				<div class="place-items-center">
					<p>
						Thank you for taking the time to answer our survey!
					</p>

					<img alt="Cat jumping happily" src={'../../../misc/happy-cat.gif'} />
				</div>
			</Dialog.Description>
		</Dialog.Header>
        <Dialog.Footer>
            <Button variant="outline" on:click={resetForms}>Stay</Button>
            <Button on:click={_ => {goto('./services')}}>Back to Services</Button>
        </Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Bug Report Dialog -->
<Dialog.Root bind:open={bugReportCompleteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>You have completed the bug report! 🎉</Dialog.Title>
			<Dialog.Description>
				<div class="place-items-center">
					<p>
						Thank you for letting us know about the issues you've encountered. 
                        We'll fix this as soon as possible! 🧡
					</p>

					<img alt="Cat jumping happily" src={'../../../misc/happy-cat.gif'} />
				</div>
			</Dialog.Description>
		</Dialog.Header>
        <Dialog.Footer>
            <Button variant="outline" on:click={resetForms}>Stay</Button>
            <Button on:click={_ => {goto('./services')}}>Back to Services</Button>
        </Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
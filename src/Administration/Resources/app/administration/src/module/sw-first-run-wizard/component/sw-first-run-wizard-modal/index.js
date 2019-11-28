import template from './sw-first-run-wizard-modal.html.twig';
import './sw-first-run-wizard-modal.scss';

const { Component } = Shopware;

Component.register('sw-first-run-wizard-modal', {
    template,

    inject: ['firstRunWizardService'],

    props: {
        title: {
            type: String,
            required: true,
            default: 'unknown title'
        }
    },

    data() {
        return {
            buttonConfig: [],
            stepVariant: 'info',
            currentStep: {
                name: '',
                variant: 'large',
                navigationIndex: 0
            },
            stepper: {
                welcome: {
                    name: 'sw.first.run.wizard.index.welcome',
                    variant: 'large',
                    navigationIndex: 0
                },
                demodata: {
                    name: 'sw.first.run.wizard.index.demodata',
                    variant: 'large',
                    navigationIndex: 1
                },
                'paypal.info': {
                    name: 'sw.first.run.wizard.index.paypal.info',
                    variant: 'large',
                    navigationIndex: 2
                },
                'paypal.credentials': {
                    name: 'sw.first.run.wizard.index.paypal.credentials',
                    variant: 'large',
                    navigationIndex: 2
                },
                plugins: {
                    name: 'sw.first.run.wizard.index.plugins',
                    variant: 'large',
                    navigationIndex: 3
                },
                'shopware.account': {
                    name: 'sw.first.run.wizard.index.shopware.account',
                    variant: 'large',
                    navigationIndex: 4
                },
                'shopware.domain': {
                    name: 'sw.first.run.wizard.index.shopware.domain',
                    variant: 'large',
                    navigationIndex: 4
                },
                finish: {
                    name: 'sw.first.run.wizard.index.finish',
                    variant: 'large',
                    navigationIndex: 5
                }
            }
        };
    },

    computed: {
        columns() {
            const res = this.showSteps
                ? '1fr 4fr'
                : '1fr';

            return res;
        },

        variant() {
            const { variant } = this.currentStep;

            return variant;
        },

        showSteps() {
            const { navigationIndex } = this.currentStep;

            return navigationIndex !== 0;
        },

        buttons() {
            return {
                right: this.buttonConfig.filter((button) => button.position === 'right'),
                left: this.buttonConfig.filter((button) => button.position === 'left')
            };
        },

        stepIndex() {
            const { navigationIndex } = this.currentStep;

            if (navigationIndex < 1) {
                return 0;
            }

            return navigationIndex - 1;
        },

        stepInitialItemVariants() {
            const navigationSteps = [
                ['disabled', 'disabled', 'disabled', 'disabled'],
                ['info', 'disabled', 'disabled', 'disabled'],
                ['success', 'info', 'disabled', 'disabled'],
                ['success', 'success', 'info', 'disabled'],
                ['success', 'success', 'success', 'info'],
                ['success', 'success', 'success', 'success']
            ];
            const { navigationIndex } = this.currentStep;

            return navigationSteps[navigationIndex];
        }
    },

    watch: {
        '$route'(to) {
            const toName = to.name.replace('sw.first.run.wizard.index.', '');

            this.currentStep = this.stepper[toName];
        }
    },

    mounted() {
        const step = this.$route.name.replace('sw.first.run.wizard.index.', '');

        this.currentStep = this.stepper[step];
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.firstRunWizardService.setFRWStart();
        },

        updateButtons(buttonConfig) {
            this.buttonConfig = buttonConfig;
        },

        onButtonClick(action) {
            if (typeof action === 'string') {
                this.redirect(action);
                return;
            }

            if (typeof action !== 'function') {
                return;
            }

            action.call();
        },

        redirect(routeName) {
            this.$router.push({ name: routeName });
        },

        finishFRW() {
            this.firstRunWizardService.setFRWFinish()
                .then(() => {
                    document.location.href = document.location.origin + document.location.pathname;
                });
        }
    }
});


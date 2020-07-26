<template>
    <v-row align="start" justify="center">
        <v-col cols="11">
            <v-row justify="space-between">
                <div
                    class="transition-swing text-h5 primary--text font-weight-medium"
                >
                    Fixed interest
                </div>
                <v-btn
                    class="text-capitalize"
                    outlined
                    color="primary"
                    @click.stop="dialog = true"
                    >Add investment</v-btn
                >
            </v-row>
            <br />

            <v-dialog v-model="dialog" persistent max-width="800px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Investment</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form
                            ref="form"
                            v-model="form.valid"
                            :lazy-validation="true"
                            @submit.prevent
                            id="purchase-form"
                            @keyup.native.enter="submit"
                        >
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12">
                                        <v-text-field
                                            v-model="form.inputs.name"
                                            required
                                            :rules="form.rules.name"
                                            label="Name*"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="form.inputs.deadline"
                                            required
                                            :rules="form.rules.deadline"
                                            hint="number of days"
                                            label="Deadline*"
                                            type="number"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="form.inputs.rate"
                                            required
                                            :rules="form.rules.rate"
                                            label="Rate*"
                                            type="number"
                                            hint="investment rate percentage"
                                            suffix="%"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="form.inputs.amount"
                                            required
                                            :rules="form.rules.amount"
                                            label="Amount*"
                                            type="number"
                                            prefix="$"
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-menu
                                            v-model="start_date_menu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                        >
                                            <template
                                                v-slot:activator="{ on, attrs }"
                                            >
                                                <v-text-field
                                                    v-model="
                                                        form.inputs.start_date
                                                    "
                                                    label="Start date"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="form.inputs.start_date"
                                                @input="start_date_menu = false"
                                            ></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-menu
                                            v-model="expiration_date_menu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="290px"
                                        >
                                            <template
                                                v-slot:activator="{ on, attrs }"
                                            >
                                                <v-text-field
                                                    v-model="
                                                        form.inputs
                                                            .expiration_date
                                                    "
                                                    label="Expiration date"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="
                                                    form.inputs.expiration_date
                                                "
                                                @input="
                                                    expiration_date_menu = false
                                                "
                                            ></v-date-picker>
                                        </v-menu>
                                    </v-col>

                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="form.inputs.gross_return"
                                            required
                                            :rules="form.rules.gross_return"
                                            label="Gross return*"
                                            type="number"
                                            prefix="$"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="8"> </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-select
                                            v-model="form.inputs.asset_class_id"
                                            :items="assetClasses"
                                            label="Asset class"
                                            item-text="name"
                                            item-value="id"
                                            flat
                                            clearable
                                            @click:clear="
                                                $nextTick(
                                                    () =>
                                                        (form.inputs.asset_class_id = null)
                                                )
                                            "
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text depressed @click="close">Close</v-btn>
                        <v-btn color="primary" text @click="submit">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-snackbar
                v-model="snackbar.show"
                :bottom="snackbar.y === 'bottom'"
                :color="snackbar.color"
                :left="snackbar.x === 'left'"
                :multi-line="snackbar.mode === 'multi-line'"
                :right="snackbar.x === 'right'"
                :timeout="snackbar.timeout"
                :top="snackbar.y === 'top'"
                :vertical="snackbar.mode === 'vertical'"
            >
                {{ snackbar.text }}

                <template v-slot:action="{ attrs }">
                    <v-btn
                        dark
                        text
                        v-bind="attrs"
                        @click="snackbar.show = false"
                    >
                        Close
                    </v-btn>
                </template>
            </v-snackbar>

            <v-data-table
                :headers="headers"
                :items="investments"
                multi-sort
                :disable-pagination="true"
                :hide-default-footer="true"
                :fixed-header="true"
                :calculate-widths="false"
                :loading="loading"
                item-key="id"
                @contextmenu:row="contextMenu"
            >
                <template v-slot:item.rate="{ item }">
                    {{ Number(item.rate) | toDecimal }}%
                </template>
                <template v-slot:item.deadline="{ item }">
                    {{ Number(item.deadline) | toDecimal }}
                </template>
                <template v-slot:item.amount="{ item }">
                    {{ Number(item.amount) | toCurrency }}
                </template>
                <template v-slot:item.gross_return="{ item }">
                    {{ Number(item.gross_return) | toCurrency }}
                </template>
                <template v-slot:item.expiration_date="{ item }">
                    <span
                        v-bind:class="
                            getConditionalFormat(item.expiration_date)
                        "
                        >{{ item.expiration_date }}</span
                    >
                </template>
            </v-data-table>
        </v-col>
        <v-menu
            v-model="menu.show"
            :position-x="menu.x"
            :position-y="menu.y"
            absolute
            offset-y
        >
            <v-list>
                <v-list-item @click="openEdit">
                    <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="confirmDelete">
                    <v-list-item-title class="pink--text"
                        >Delete</v-list-item-title
                    >
                </v-list-item>
            </v-list>
        </v-menu>
        <v-dialog v-model="confirmDeleteDialog" max-width="290">
            <v-card>
                <v-card-title class="headline">Delete investment?</v-card-title>

                <v-card-text>
                    This action will permanently remove this investment from
                    your portfolio. Do you want to continue?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="confirmDeleteDialog = false">
                        Cancel
                    </v-btn>

                    <v-btn color="pink darken-1" text @click="deleteInvestment">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script src="./AllFixedInterest.js"></script>

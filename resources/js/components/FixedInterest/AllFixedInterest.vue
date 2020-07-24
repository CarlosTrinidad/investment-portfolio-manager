<template>
    <v-row align="start" justify="center">
        <v-col cols="11">
            <v-row justify="space-between">
                <div
                    class="transition-swing text-h5 primary--text font-weight-medium"
                >
                    Fixed interest investments
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
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <v-text-field
                                            v-model="form.inputs.amount"
                                            required
                                            :rules="form.rules.amount"
                                            label="Amount*"
                                            type="number"
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

            <!-- <v-data-table
                :headers="headers"
                :items="purchases"
                multi-sort
                :disable-pagination="true"
                :hide-default-footer="true"
                :fixed-header="true"
                :calculate-widths="false"
                :loading="loading"
                show-expand
                :expanded.sync="expanded"
                @item-expanded="getDetail"
                item-key="id"
            >
                <template v-slot:body.append>
                    <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            {{ Number(aggregated.total_shares) | toDecimal }}
                        </td>
                        <td>-</td>
                        <td>-</td>

                        <td>
                            {{ Number(aggregated.cost_basis) | toCurrency }}
                        </td>
                        <td>
                            {{ Number(aggregated.market_value) | toCurrency }}
                        </td>
                        <td>
                            <span
                                v-bind:class="
                                    getConditionalFormat(aggregated.gain_loss)
                                "
                            >
                                {{ Number(aggregated.gain_loss) | toCurrency }}
                            </span>
                        </td>
                        <td>
                            <span
                                v-bind:class="
                                    getConditionalFormat(aggregated.growth)
                                "
                            >
                                {{ Number(aggregated.growth) | toDecimal }}%
                            </span>
                        </td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            {{ Number(aggregated.anual_income) | toCurrency }}
                        </td>
                    </tr>
                </template>
                <template v-slot:item.total_shares="{ item }">
                    {{ Number(item.total_shares) | toDecimal }}
                </template>
                <template v-slot:item.average_buy_price="{ item }">
                    {{ Number(item.average_buy_price) | toCurrency }}
                </template>
                <template v-slot:item.market_price="{ item }">
                    {{ Number(item.market_price) | toCurrency }}
                </template>
                <template v-slot:item.cost_basis="{ item }">
                    {{ Number(item.cost_basis) | toCurrency }}
                </template>
                <template v-slot:item.market_value="{ item }">
                    {{ Number(item.market_value) | toCurrency }}
                </template>
                <template v-slot:item.gain_loss="{ item }">
                    <span v-bind:class="getConditionalFormat(item.gain_loss)">{{
                        Number(item.gain_loss) | toCurrency
                    }}</span>
                </template>
                <template v-slot:item.growth="{ item }">
                    <span v-bind:class="getConditionalFormat(item.growth)"
                        >{{ Number(item.growth) | toDecimal }}%</span
                    >
                </template>
                <template v-slot:item.anual_dividend="{ item }">
                    {{ Number(item.anual_dividend) | toCurrency }}
                </template>
                <template v-slot:item.dividend_yield="{ item }">
                    {{ Number(item.dividend_yield) | toDecimal }}%
                </template>
                <template v-slot:item.anual_income="{ item }">
                    {{ Number(item.anual_income) | toCurrency }}
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                    <fragment v-if="item.detail.length === 0">
                        <td :colspan="headers.length">
                            <div>
                                Loading...
                                <v-progress-circular
                                    indeterminate
                                    :width="3"
                                    color="primary"
                                ></v-progress-circular>
                            </div>
                        </td>
                    </fragment>

                    <fragment v-else>
                        <td :colspan="headers.length" class="no-padding">
                            <div class="transition-swing text-h6 pa-4 ml-5">
                                {{ item.name }}
                                <v-chip
                                    v-if="item.description.length > 0"
                                    class="ma-2"
                                    small
                                    outlined
                                >
                                    {{ item.description }}
                                </v-chip>
                            </div>
                            <v-simple-table class="expanded-row">
                                <template v-slot:default>
                                    <tbody>
                                        <tr
                                            v-for="(line, index) in item.detail"
                                            :key="index"
                                            @contextmenu="
                                                contextMenu($event, line)
                                            "
                                        >
                                            <td width="56px"></td>
                                            <td width="225px">
                                                {{ line.name }}
                                            </td>
                                            <td width="120px">
                                                {{ line.symbol }}
                                            </td>
                                            <td width="110px">
                                                {{
                                                    Number(line.shares)
                                                        | toDecimal
                                                }}
                                            </td>
                                            <td width="155px">
                                                {{
                                                    Number(line.buy_price)
                                                        | toCurrency
                                                }}
                                            </td>
                                            <td
                                                :colspan="headers.length - 5"
                                            ></td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </td>
                    </fragment>
                </template>
            </v-data-table> -->
        </v-col>
        <!-- <v-menu
            v-model="showMenu"
            :position-x="x"
            :position-y="y"
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
        </v-menu> -->
        <!-- <v-dialog v-model="confirmDeleteDialog" max-width="290">
            <v-card>
                <v-card-title class="headline">Delete purchase?</v-card-title>

                <v-card-text>
                    This action will permanently remove this purchase from your
                    portfolio. Do you want to continue?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="confirmDeleteDialog = false">
                        Cancel
                    </v-btn>

                    <v-btn color="pink darken-1" text @click="deletePurchase">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
    </v-row>
</template>

<script src="./AllFixedInterest.js"></script>

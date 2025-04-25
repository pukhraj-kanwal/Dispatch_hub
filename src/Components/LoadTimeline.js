import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STAGES = [
    { key: 'Pickup', label: 'Pickup', icon: 'package-variant-closed' },
    { key: 'In Transit', label: 'In Transit', icon: 'truck-fast' },
    { key: 'Delivery', label: 'Delivery', icon: 'package-variant' },
];

function LoadTimeline({ currentStage, pickupTime, transitTime, deliveryTime }) {
    const theme = useTheme();
    const currentStageIndex = STAGES.findIndex(s => s.key === currentStage);

    return (
        <View style={styles.container}>
            {STAGES.map((stage, index) => {
                const isActive = index === currentStageIndex;
                const isCompleted = index < currentStageIndex;
                const isFuture = index > currentStageIndex;

                const stageColor = isActive ? theme.colors.primary : (isCompleted ? theme.colors.success : theme.colors.disabled);
                const lineColor = isCompleted ? theme.colors.success : theme.colors.disabled;

                const getTimeForStage = () => {
                    if (stage.key === 'Pickup') return pickupTime;
                    if (stage.key === 'In Transit') return transitTime;
                    if (stage.key === 'Delivery') return deliveryTime;
                    return null;
                }

                const time = getTimeForStage();

                return (
                    <View key={stage.key} style={styles.stageContainer}>
                        {/* Line connecting stages (except for the first one) */} 
                        {index > 0 && (
                           <View style={[styles.line, { backgroundColor: lineColor }]} />
                        )}

                        {/* Stage Icon and Text */} 
                        <View style={styles.iconTextContainer}>
                             <MaterialCommunityIcons name={stage.icon} size={24} color={stageColor} />
                             <Text style={[styles.stageLabel, { color: stageColor }]}>{stage.label}</Text>
                             {time && <Text style={[styles.stageTime, { color: stageColor }]}>{time}</Text>}
                         </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 16,
        paddingHorizontal: 10, // Add some padding
    },
    stageContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative', // Needed for line positioning
    },
    line: {
        height: 2,
        flex: 1,
        marginHorizontal: -12, // Overlap slightly with icon area
        alignSelf: 'center', // Center line vertically with icon
        position: 'relative',
        top: 12, // Align vertically with icon center
        zIndex: -1, // Draw behind icon
    },
    iconTextContainer: {
        alignItems: 'center',
        flex: 1, // Allow text to wrap if needed
    },
    stageLabel: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    stageTime: {
        fontSize: 10,
        color: 'grey',
        marginTop: 2,
        textAlign: 'center',
    }
});

export default LoadTimeline; 